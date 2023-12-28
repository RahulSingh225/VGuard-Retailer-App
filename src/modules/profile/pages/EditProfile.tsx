import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import colors from '../../../../colors';
import { getCities, getDistricts, getFile, getRetailerCategoryDealIn, getRishtaUserProfile, getStates, sendFile, updateProfile } from '../../../utils/apiservice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { UserData } from '../../../utils/modules/UserData';
import InputField from '../../../components/InputField';
import Buttons from '../../../components/Buttons';
import PickerField from '../../../components/PickerField';
import DatePickerField from '../../../components/DatePickerField';
import Popup from '../../../components/Popup';
import Snackbar from 'react-native-snackbar';
import ImagePickerField from '../../../components/ImagePickerField';
import MultiSelectField from '../../../components/MultiSelectField';
import Loader from '../../../components/Loader';
import moment from 'moment';


const EditProfile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();

  const baseURL = 'https://www.vguardrishta.com/img/appImages/Profile/';
  const ecardURL = 'https://www.vguardrishta.com/img/appImages/eCard/';

  const [userData, setUserData] = useState<UserData | any>();
  const [postData, setPostData] = useState<UserData | any>();
  const [profileImage, setProfileImage] = useState(null);
  const [isShopAddressDifferent, setIsShopAddressDifferent] = useState('Yes');
  const [enrolledOtherSchemeYesNo, setEnrolledOtherSchemeYesNo] = useState('Yes');
  const [retailerCategoryDealIn, setRetailerCategoryDealIn] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [IdFrontUid, setIdFrontUid] = useState("");
  const [IdBackUid, setIdBackUid] = useState("");
  const [gstUid, setGstUid] = useState("");
  const [selfie, setSelfie] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [stateId, setStateId] = useState("");

  useEffect(() => {
    // showLoader(true);
    getRishtaUserProfile()
      .then(response => response.json())
      .then(res => {
        setUserData(res);
        setPostData(res);
        setStateId(res.stateId);
        setGstUid(res.kycDetails.gstFront);
        setSelfie(res.kycDetails.selfie);
        setIdBackUid(res.kycDetails.aadharOrVoterOrDlBack);
        setIdFrontUid(res.kycDetails.aadharOrVoterOrDLFront);
        const image = selfie;
        console.log("SELFIE----------", image);
      })

    getRetailerCategoryDealIn()
      .then(response => response.json())
      .then((responseData) => {
        setRetailerCategoryDealIn(responseData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  useEffect(() => {
    console.log("State ID:-------", stateId)
    if (stateId !== undefined && stateId !== "") {
      fetchData();
      console.log("USER DATA--------------", userData);
    }
    console.log(">><><><><>SELFIE", selfie)
  }, [stateId, selfie]);

  const fetchData = async () => {
    try {
      const statesResponse = await getStates();
      const statesData = await statesResponse.data;
      setStates(statesData);

      const defaultState = postData.stateId;

      const districtsResponse = await getDistricts(defaultState);
      const districtsData = await districtsResponse.data;

      if (Array.isArray(districtsData)) {
        setDistricts(districtsData);

        if (Array.isArray(districtsData) && districtsData.length > 0) {
          const citiesResponse = await getCities(postData.distId);
          const citiesData = await citiesResponse.data;
          console.log("CITIES-----------", citiesData);
          setCities(citiesData);
        }
      } else {
        console.error('Error: Districts data is not an array.', districtsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    console.log("ID PROOF:", userData?.kycDetails?.aadharOrVoterOrDlNo)
    if (userData?.roleId && userData?.kycDetails?.selfie) {
      const getImage = async () => {
        try {
          const profileImageUrl = await getFile(userData.kycDetails.selfie, 'PROFILE', 2);
          if (profileImageUrl.status === 500) {
            setProfileImage(null);
          }
          else {
            setProfileImage(profileImageUrl.url);
          }
        } catch (error) {
          console.log('Error while fetching profile image:', error);
        }
      };

      getImage();
    }
  }, [userData?.roleId, userData?.kycDetails?.selfie]);

  const openEVisitingCard = () => {
    Linking.openURL(ecardURL + userData.ecardPath);
  };

  const handleSubmit = async () => {
    try {
      console.log("Post Data:", postData);
  
      const currentDate = new Date();
      const dobDate = moment(postData?.dob, 'DD MMM YYYY').toDate();
      const minAllowedDate = new Date(currentDate);
      minAllowedDate.setFullYear(currentDate.getFullYear() - 18);
  
      console.log(postData?.dob);
      console.log(dobDate);
  
      if (dobDate < minAllowedDate) {
        const idFrontUid = await triggerApiWithImage(idFrontFileData);
        const idBackUid = await triggerApiWithImage(idBackFileData);
        const selfieUid = await triggerApiWithImage(selfieFileData);
        const gstUid = await triggerApiWithImage(GstFileData);
  
        setPostDataOfImage('aadharOrVoterOrDLFront', idFrontUid);
        setPostDataOfImage('aadharOrVoterOrDlBack', idBackUid);
        setPostDataOfImage('selfie', selfieUid);
        setPostDataOfImage('gstFront', gstUid);
  
        updateProfile(postData)
          .then(response => response.json())
          .then((responseData) => {
            setPopupVisible(true);
            setPopupContent(responseData?.message);
            console.log("<><<><<><>><", responseData, "<><<<><><><><><><<><");
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      } else {
        Snackbar.show({
          text: 'The age should be at least 18 years.',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };
  


  const handleChange = (label: string, value: string) => {
    if (label == "isShopDifferent") {
      setIsShopAddressDifferent(value)
    }
    else if (label == "enrolledOtherSchemeYesNo") {
      setEnrolledOtherSchemeYesNo(value)
    }
    else if (label == "maritalStatus") {
      setPostData((prevData: UserData) => ({
        ...prevData,
        [label]: value,
      }));
    }
    else if (label == "gstYesNo") {
      setPostData((prevData: UserData) => ({
        ...prevData,
        kycDetails: {
          ...prevData.kycDetails,
          [label]: value
        }
      }))
    }

    console.log("Changed")
  }

  const handleInputChange = (value: string, label: string) => {
    setPostData((prevData: UserData) => {
      let updatedValue: any = value;

      if (['annualBusinessPotential'].includes(label)) {
        updatedValue = parseFloat(value);
        if (isNaN(updatedValue)) {
          updatedValue = null;
        }
      }
      return {
        ...prevData,
        [label]: updatedValue,
      };
    });
  };

  const genderpickerItems = [
    { label: 'Select Gender', value: '' },
    { label: 'Male', value: 'Male ' },
    { label: 'Female', value: 'Female ' },
    { label: 'Other', value: 'Other ' },
  ];
  const selectYesorNo = [
    { label: 'Select Option', value: '' },
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ];
  const maritalStatusItems = [
    { label: 'Select Marital Status', value: '' },
    { label: 'Married', value: '1' },
    { label: 'UnMarried', value: '2' }
  ];

  const [idFrontFileData, setIdFrontFileData] = useState({
    uri: "",
    name: "",
    type: ""
  })
  const [idBackFileData, setIdBackFileData] = useState({
    uri: "",
    name: "",
    type: ""
  })
  const [selfieFileData, setSelfieFileData] = useState({
    uri: "",
    name: "",
    type: ""
  })
  const [GstFileData, setGstFileData] = useState({
    uri: "",
    name: "",
    type: ""
  })

  const handleImageChange = async (image: string, type: string, imageName: string, label: string) => {
    try {
      if (label === "Id Proof* (Front)") {
        setIdFrontFileData({
          uri: image,
          name: imageName,
          type: type
        })
      } else if (label === "Id Proof* (Back)") {
        setIdBackFileData({
          uri: image,
          name: imageName,
          type: type
        })
      } else if (label === "Selfie") {
        setSelfieFileData({
          uri: image,
          name: imageName,
          type: type
        })
      } else if (label === "GST Photo") {
        setGstFileData({
          uri: image,
          name: imageName,
          type: type
        })
      }

    } catch (error) {
      console.error('Error handling image change in EditProfile:', error);
    }
  };

  const triggerApiWithImage = async (fileData: { uri: string; type: string; name: string }) => {
    try {
      const formData = new FormData();
      formData.append('USER_ROLE', '2');
      formData.append('image_related', 'CHEQUE');
      formData.append('file', {
        uri: fileData.uri,
        name: fileData.name,
        type: fileData.type,
      });

      console.log("formData=====", formData);

      const response = await sendFile(formData);
      console.log("response-----------", response.data.entityUid);

      return response.data.entityUid;
    } catch (error) {
      setPopupContent("Error uploading image");
      setPopupVisible(true);
      console.error('API Error:', error);
      throw error; // rethrow the error to propagate it further
    }
  };

  const setPostDataOfImage = (label: string, value: string) => {
    console.log("POST IMAGE------", label, value);
    setPostData((prevData: UserData) => ({
      ...prevData,
      kycDetails: {
        ...prevData.kycDetails,
        [label]: value,
      }
    }));
  };


  const handleStateSelect = async (text: string) => {
    const selectedCategory = states.find(category => category.stateName === text);

    setPostData((prevData: UserData) => ({
      ...prevData,
      state: text,
      stateId: selectedCategory?.id || null,
    }));

    getDistricts(selectedCategory?.id)
      .then(response => response.data)
      .then((data) => {
        setDistricts(data);
      })
  }
  const handleDistrictSelect = async (text: string) => {
    const selectedCategory = districts.find(category => category.districtName === text);

    setPostData((prevData: UserData) => ({
      ...prevData,
      dist: text,
      distId: selectedCategory?.id || null,
    }));

    getCities(selectedCategory?.id)
      .then(response => response.data)
      .then((data) => {
        setCities(data);
      })
  }
  const handleCitySelect = async (text: string) => {
    const selectedCategory = cities.find(category => category.cityName === text);

    setPostData((prevData: UserData) => ({
      ...prevData,
      city: text,
      cityId: selectedCategory?.id || null,
    }));
  }


  return (
    <ScrollView style={styles.mainWrapper}>
      {/* {loader && <Loader />} */}
      <View style={styles.flexBox}>
        <View style={styles.ImageProfile}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: 100 }} resizeMode='contain' />
          ) : (
            <Image source={require('../../../assets/images/ic_v_guards_user.png')} style={{ width: '100%', height: '100%', borderRadius: 100 }} resizeMode='contain' />
          )}
        </View>
        <View style={styles.profileText}>
          <Text style={styles.textDetail}>{userData?.name}</Text>
          <Text style={styles.textDetail}>{userData?.userCode}</Text>
          <TouchableOpacity onPress={openEVisitingCard}>
            <Text style={styles.viewProfile}>{t('strings:view_e_card')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <InputField
          label={t('strings:preferred_language')}
          value={userData?.preferredLanguage}
          disabled={true}
        />
        <InputField
          label={t('strings:retailer_name')}
          value={postData?.name}
          onChangeText={(text) => handleInputChange(text, 'name')}
        />
        <InputField
          label={t('strings:contact_number')}
          value={userData?.contactNo}
          disabled={true}
        />
        <InputField
          label={t('strings:store_firm_name')}
          value={postData?.firmName}
          onChangeText={(text) => handleInputChange(text, 'firmName')}
        />
        <PickerField
          label={t('strings:lbl_gender_mandatory')}
          disabled={false} // Optional
          selectedValue={postData?.gender}
          onValueChange={(text) => handleInputChange(text, 'gender')}
          items={genderpickerItems}
        />
        <DatePickerField
          label={t('strings:lbl_date_of_birth_mandatory')}
          date={postData?.dob}
          onDateChange={(date) => handleInputChange(date, 'dob')}
        />
        <InputField
          label={t('strings:email')}
          value={postData?.emailId}
          onChangeText={(text) => handleInputChange(text, 'emailId')}
        />
        <Text style={styles.subHeading}>{t('strings:permanent_address')}</Text>
        <InputField
          label={t('strings:lbl_permanent_address_mandatory')}
          value={postData?.permanentAddress}
          onChangeText={(text) => handleInputChange(text, 'permanentAddress')}
        />
        <InputField
          label={t('strings:lbl_street_locality')}
          value={postData?.streetAndLocality}
          onChangeText={(text) => handleInputChange(text, 'streetAndLocality')}
        />
        <InputField
          label={t('strings:lbl_landmark')}
          value={postData?.landmark}
          onChangeText={(text) => handleInputChange(text, 'landmark')}
        />
        <InputField
          label={t('strings:pincode')}
          value={postData?.pinCode}
          onChangeText={(text) => handleInputChange(text, 'pinCode')}
          numeric
          maxLength={6}
        />
        <PickerField
          label={t('strings:lbl_state')}
          disabled={false}
          selectedValue={postData?.state}
          onValueChange={(text: string) => handleStateSelect(text)}
          items={states.map(state => ({ label: state.stateName, value: state.stateName }))}
        />
        <PickerField
          label={t('strings:district')}
          disabled={false}
          selectedValue={postData?.dist}
          onValueChange={(text: string) => handleDistrictSelect(text)}
          items={districts.map(district => ({ label: district.districtName, value: district.districtName }))}
        />
        <PickerField
          label={t('strings:city')}
          disabled={false}
          selectedValue={postData?.city}
          onValueChange={(text: string) => handleCitySelect(text)}
          items={cities.map(city => ({ label: city.cityName, value: city.cityName }))}
        />
        <PickerField
          label={t('strings:is_shop_address_different')}
          selectedValue={isShopAddressDifferent}
          onValueChange={(text: string) => handleChange("isShopDifferent", text)}
          items={selectYesorNo}
        />
        <PickerField
          label={t('strings:lbl_marital_status')}
          selectedValue={postData?.maritalStatus}
          onValueChange={(text: string) => handleInputChange(text, 'maritalStatus')}
          items={maritalStatusItems}
        />
        <InputField
          label={t('strings:what_is_that_one_gift_you_aspire_for')}
          value={postData?.aspireGift}
          onChangeText={(text) => handleInputChange(text, 'aspireGift')}
        />
        <MultiSelectField
          label={t('strings:select_category_you_deal_in')}
          selectedValues={postData?.categoryDealIn ? postData.categoryDealIn.split(', ') : []}
          onValuesChange={(selectedItems: string[]) => {
            const selectedCategories = selectedItems.map(item => {
              const category = retailerCategoryDealIn.find(cat => cat.prodCatName === item);
              return category?.prodCatName || '';
            });

            setPostData((prevData: UserData) => {
              const categoryDealInIDArray = selectedItems.map(item => {
                const category = retailerCategoryDealIn.find(cat => cat.prodCatName === item);
                return category?.prodCatId || null;
              });

              const categoryDealInIDString = categoryDealInIDArray.join(', ');

              return {
                ...prevData,
                categoryDealIn: selectedCategories.join(', '),
                categoryDealInID: categoryDealInIDString,
              };
            });
          }}
          items={retailerCategoryDealIn.map(category => ({
            label: category.prodCatName,
            value: category.prodCatName,
          }))}
        />


        <PickerField
          label={t('strings:already_enrolled_into_loyalty_scheme')}
          disabled={false} // Optional
          selectedValue={enrolledOtherSchemeYesNo}
          onValueChange={(text: string) => handleChange("enrolledOtherSchemeYesNo", text)}
          items={selectYesorNo}
        />
        <InputField
          label={t('strings:annual_business_potential')}
          value={postData?.annualBusinessPotential?.toString()}
          onChangeText={(text) => handleInputChange(text, 'annualBusinessPotential')}
          numeric
        />
        <ImagePickerField
          label='Selfie'
          onImageChange={handleImageChange}
          imageRelated='PROFILE'
          initialImage={userData?.kycDetails?.selfie}
        />
        <ImagePickerField label='Id Proof* (Front)'
          onImageChange={handleImageChange}
          imageRelated='ID_CARD_FRONT'
          initialImage={userData?.kycDetails?.aadharOrVoterOrDLFront}
        />
        <ImagePickerField label='Id Proof* (Back)'
          onImageChange={handleImageChange}
          imageRelated="ID_CARD_BACK"
          initialImage={userData?.kycDetails?.aadharOrVoterOrDlBack}
        />
        <InputField
          label={t('strings:id_proof_no')}
          value={postData?.kycDetails?.aadharOrVoterOrDlNo}
          onChangeText={(text) => handleInputChange(text, 'kycDetails.aadharOrVoterOrDlNo')}
        />
        <PickerField
          label={t('strings:do_you_have_gst_number')}
          selectedValue={postData?.kycDetails?.gstYesNo}
          onValueChange={(text: string) => handleChange("gstYesNo", text)}
          items={selectYesorNo}
        />
        <InputField
          label={t('strings:gst_no')}
          value={postData?.kycDetails?.gstNo}
          onChangeText={(text) => handleInputChange(text, 'kycDetails.gstNo')}
        />
        <ImagePickerField label='GST Photo'
          onImageChange={handleImageChange}
          imageRelated="GST"
          initialImage={userData?.kycDetails?.gstFront}
        />

        <View style={styles.button}>
          <Buttons
            label={t('strings:submit')}
            variant="filled"
            onPress={() => handleSubmit()}
            width="100%"
          />
        </View>
      </View>
      {isPopupVisible && (
        <Popup isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}>
          {popupContent}
        </Popup>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    padding: 15,
    flex: 1,
    backgroundColor: colors.white,
  },
  ImageProfile: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  textName: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(3),
    marginTop: responsiveHeight(2),
  },
  label: {
    color: colors.grey,
    fontSize: responsiveFontSize(1.7),
    marginTop: responsiveHeight(3),
    fontWeight: 'bold'
  },
  textDetail: {
    color: colors.black,
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold'
  },
  viewProfile: {
    color: colors.yellow,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7),
  },
  data: {
    color: colors.black,
    fontSize: responsiveFontSize(1.7),
    marginTop: responsiveHeight(3),
    textAlign: 'right',
    fontWeight: 'bold'
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  detailsContainer: {
    flexDirection: 'column',
    marginVertical: 30
  },
  subHeading: {
    color: colors.grey,
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    marginBottom: 20
  },
  button: {
    marginBottom: 30
  },
  container: {
    height: 50,
    marginBottom: 20,
    borderColor: colors.lightGrey,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  focusedContainer: {
    borderColor: colors.grey,
  },
  label: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: colors.black,
    backgroundColor: colors.white,
    paddingHorizontal: 3,
  },
  focusedLabel: {
    position: 'absolute',
    top: -8,
    left: 10,
    fontSize: responsiveFontSize(1.5),
    color: colors.black,
  },
  input: {
    color: colors.black,
    paddingTop: 10,
  },
  disabledInput: {
    color: colors.grey,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
});

export default EditProfile;
