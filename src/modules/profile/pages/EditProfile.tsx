import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import colors from '../../../../colors';
import { getCities, getDistricts, getFile, getRetailerCategoryDealIn, getRishtaUserProfile, getStates, getUser, sendFile, updateProfile } from '../../../utils/apiservice';
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
  const [additionalFieldsCount, setAdditionalFieldsCount] = useState(1);
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
  const [loader, showLoader] = useState(true);

  useEffect(() => {
    getUser()
      .then(response => response.json())
      .then(res => {
        console.log(res);
        setUserData(res);
        setPostData(res);
        setStateId(res.stateId);
        setGstUid(res.kycDetails.gstFront);
        setSelfie(res.kycDetails.selfie);
        setIdBackUid(res.kycDetails.aadharOrVoterOrDlBack);
        setIdFrontUid(res.kycDetails.aadharOrVoterOrDLFront);
        const image = selfie;
        showLoader(false);
      })
      .catch(error => {
        setPopupContent("Something Went Wrong!");
        setPopupVisible(true);
        showLoader(false);
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
    if (stateId !== undefined && stateId !== "") {
      fetchData();
    }
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
    showLoader(true);
    try {

      const currentDate = new Date();
      const dobDate = moment(postData?.dob, 'DD MMM YYYY').toDate();
      const minAllowedDate = new Date(currentDate);
      minAllowedDate.setFullYear(currentDate.getFullYear() - 18);

      if (dobDate < minAllowedDate) {
        // Store promises for each image upload
        const selfiePromise = selfieFileData.uri !== "" ? triggerApiWithImage(selfieFileData, 'PROFILE') : Promise.resolve(null);
        const idFrontPromise = idFrontFileData.uri !== "" ? triggerApiWithImage(idFrontFileData, 'ID_CARD_FRONT') : Promise.resolve(null);
        const idBackPromise = idBackFileData.uri !== "" ? triggerApiWithImage(idBackFileData, 'ID_CARD_BACK') : Promise.resolve(null);
        const gstPromise = GstFileData.uri !== "" ? triggerApiWithImage(GstFileData, 'GST') : Promise.resolve(null);

        // Wait for all image uploads to complete
        const [selfieUid, idFrontUid, idBackUid, gstUid] = await Promise.all([selfiePromise, idFrontPromise, idBackPromise, gstPromise]);

        // Check if any image upload failed
        if (selfieFileData.uri !== "" && selfieUid === null) {
          Snackbar.show({
            text: 'Error uploading selfie image.',
            duration: Snackbar.LENGTH_LONG,
          });
          return;
        }

        if (idFrontFileData.uri !== "" && idFrontUid === null) {
          Snackbar.show({
            text: 'Error uploading ID card front image.',
            duration: Snackbar.LENGTH_LONG,
          });
          return;
        }

        if (idBackFileData.uri !== "" && idBackUid === null) {
          Snackbar.show({
            text: 'Error uploading ID card back image.',
            duration: Snackbar.LENGTH_LONG,
          });
          return;
        }

        if (GstFileData.uri !== "" && gstUid === null) {
          Snackbar.show({
            text: 'Error uploading GST image.',
            duration: Snackbar.LENGTH_LONG,
          });
          return;
        }

        // Update profile with successful image uploads
        if (selfieFileData.uri !== "" && selfieUid !== null) {
          setPostDataOfImage('selfie', selfieUid);
        }

        if (idFrontFileData.uri !== "" && idFrontUid !== null) {
          setPostDataOfImage('aadharOrVoterOrDLFront', idFrontUid);
        }

        if (idBackFileData.uri !== "" && idBackUid !== null) {
          setPostDataOfImage('aadharOrVoterOrDlBack', idBackUid);
        }

        if (GstFileData.uri !== "" && gstUid !== null) {
          setPostDataOfImage('gstFront', gstUid);
        }

        // Update the profile data
        updateProfile(postData)
          .then(response => response.json())
          .then((responseData) => {
            setPopupVisible(true);
            setPopupContent(responseData?.message);
            showLoader(false);
          })
          .catch(error => {
            setPopupContent("Error Updating Profile");
            setPopupVisible(true);
            showLoader(false);
          });
      } else {
        setPopupContent('The age should be at least 18 years.');
        setPopupVisible(true);
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
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];
  const selectYesorNo = [
    { label: 'Select Option', value: '' },
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ];
  const maritalStatusItems = [
    { label: 'Select Marital Status', value: '' },
    { label: 'Married', value: 'Married' },
    { label: 'UnMarried', value: 'UnMarried' }
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
      let fileData = {
        uri: image,
        name: imageName,
        type: type,
      };

      if (label === "Id Proof* (Front)") {
        setIdFrontFileData(fileData);
      } else if (label === "Id Proof* (Back)") {
        setIdBackFileData(fileData);
      } else if (label === "Selfie") {
        setSelfieFileData(fileData);
      } else if (label === "GST Photo") {
        setGstFileData(fileData);
      }

    } catch (error) {
      console.error('Error handling image change in EditProfile:', error);
    }
  };


  const triggerApiWithImage = async (fileData: { uri: string; type: string; name: string }, imageRelated: string) => {
    try {
      const formData = new FormData();
      formData.append('USER_ROLE', '2');
      formData.append('image_related', imageRelated);
      formData.append('file', {
        uri: fileData.uri,
        name: fileData.name,
        type: fileData.type,
      });

      const response = await sendFile(formData);
      return response.data.entityUid;
    } catch (error) {
      setPopupContent("Error uploading image");
      setPopupVisible(true);
      console.error('API Error:', error);
      throw error; // rethrow the error to propagate it further
    }
  };

  const setPostDataOfImage = (label: string, value: string) => {
    setPostData((prevData: UserData) => ({
      ...prevData,
      kycDetails: {
        ...prevData.kycDetails,
        [label]: value,
      }
    }));
  };


  const handleStateSelect = async (text: string, type: string) => {
    const selectedCategory = states.find(category => category.stateName === text);
    if (type == "permanent") {
      setPostData((prevData: UserData) => ({
        ...prevData,
        state: text,
        stateId: selectedCategory?.id || null,
      }));
    }
    else if (type == "current") {
      setPostData((prevData: UserData) => ({
        ...prevData,
        currState: text,
        currStateId: selectedCategory?.id || null,
      }));
    }
    getDistricts(selectedCategory?.id)
      .then(response => response.data)
      .then((data) => {
        setDistricts(data);
      })
  }
  const handleDistrictSelect = async (text: string, type: string) => {
    const selectedCategory = districts.find(category => category.districtName === text);
    if (type == "permanent") {
      setPostData((prevData: UserData) => ({
        ...prevData,
        dist: text,
        distId: selectedCategory?.id || null,
      }));
    }
    else if (type == "current") {
      setPostData((prevData: UserData) => ({
        ...prevData,
        currDist: text,
        currDistId: selectedCategory?.id || null,
      }));
    }
    getCities(selectedCategory?.id)
      .then(response => response.data)
      .then((data) => {
        setCities(data);
      })
  }
  const handleCitySelect = async (text: string, type: string) => {
    const selectedCategory = cities.find(category => category.cityName === text);
    if (type == "permanent") {
      setPostData((prevData: UserData) => ({
        ...prevData,
        city: text,
        cityId: selectedCategory?.id || null,
      }));
    }
    else if (type == "current") {
      setPostData((prevData: UserData) => ({
        ...prevData,
        currCity: text,
        currCityId: selectedCategory?.id || null,
      }));
    }
  }


const renderAdditionalFields = () => {
  const additionalFields = [];

  for (let i = 2; i <= additionalFieldsCount; i++) {
    if(i<=5){
      additionalFields.push(
        <View key={i}>
          <InputField
            label={t('strings:if_yes_please_mention_scheme_and_brand_name')}
            value={postData?.[`otherSchemeBrand${i}`]}
            onChangeText={(text) => handleInputChange(text, `otherSchemeBrand${i}`)}
            numeric
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ flex: 1 }}>
              <InputField
                label={t('strings:if_yes_what_you_liked_about_the_program')}
                value={postData?.[`abtOtherSchemeLiked${i}`]}
                onChangeText={(text) => handleInputChange(text, `abtOtherSchemeLiked${i}`)}
                numeric
              />
            </View>
            {i < 5 && (
              <TouchableOpacity onPress={() => setAdditionalFieldsCount((prev) => prev + 1)}>
                <Image
                  source={require('../../../assets/images/ic_add_yellow.webp')}
                  style={{ width: 30, height: 30, marginBottom: 15 }}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }
  }

  return additionalFields;
};

  return (
    <ScrollView style={styles.mainWrapper}>
      {loader && <Loader isLoading={loader} />}
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
          onValueChange={(text: string) => handleStateSelect(text, 'permanent')}
          items={states.map(state => ({ label: state.stateName, value: state.stateName }))}
        />
        <PickerField
          label={t('strings:district')}
          disabled={false}
          selectedValue={postData?.dist}
          onValueChange={(text: string) => handleDistrictSelect(text, 'permanent')}
          items={districts.map(district => ({ label: district.districtName, value: district.districtName }))}
        />
        <PickerField
          label={t('strings:city')}
          disabled={false}
          selectedValue={postData?.city}
          onValueChange={(text: string) => handleCitySelect(text, 'permanent')}
          items={cities.map(city => ({ label: city.cityName, value: city.cityName }))}
        />
        <PickerField
          label={t('strings:is_shop_address_different')}
          selectedValue={isShopAddressDifferent}
          onValueChange={(text: string) => handleChange("isShopDifferent", text)}
          items={selectYesorNo}
        />
        {isShopAddressDifferent == "No" ? (
          <>
            <Text style={styles.subHeading}>{t('strings:current_address')}</Text>

            <InputField
              label={t('strings:lbl_current_address_mandatory')}
              value={postData?.currentAddress}
              onChangeText={(text) => handleInputChange(text, 'currentAddress')}
            />
            <InputField
              label={t('strings:lbl_street_locality')}
              value={postData?.currStreetAndLocality}
              onChangeText={(text) => handleInputChange(text, 'currStreetAndLocality')}
            />
            <InputField
              label={t('strings:lbl_landmark')}
              value={postData?.currLandmark}
              onChangeText={(text) => handleInputChange(text, 'currLandmark')}
            />
            <InputField
              label={t('strings:pincode')}
              value={postData?.currPinCode}
              onChangeText={(text) => handleInputChange(text, 'currPinCode')}
              numeric
              maxLength={6}
            />
            <PickerField
              label={t('strings:lbl_state')}
              disabled={false}
              selectedValue={postData?.currState}
              onValueChange={(text: string) => handleStateSelect(text, 'current')}
              items={states.map(state => ({ label: state.stateName, value: state.stateName }))}
            />
            <PickerField
              label={t('strings:district')}
              disabled={false}
              selectedValue={postData?.currDist}
              onValueChange={(text: string) => handleDistrictSelect(text, 'current')}
              items={districts.map(district => ({ label: district.districtName, value: district.districtName }))}
            />
            <PickerField
              label={t('strings:city')}
              disabled={false}
              selectedValue={postData?.currCity}
              onValueChange={(text: string) => handleCitySelect(text, 'current')}
              items={cities.map(city => ({ label: city.cityName, value: city.cityName }))}
            />
          </>
        ) : null}
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
        {enrolledOtherSchemeYesNo === 'Yes' && (
          <>
            <InputField
              label={t('strings:if_yes_please_mention_scheme_and_brand_name')}
              value={postData?.otherSchemeBrand?.toString()}
              onChangeText={(text) => handleInputChange(text, 'otherSchemeBrand')}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ flex: 1 }}>
                <InputField
                  label={t('strings:if_yes_what_you_liked_about_the_program')}
                  value={postData?.abtOtherSchemeLiked?.toString()}
                  onChangeText={(text) => handleInputChange(text, 'abtOtherSchemeLiked')}
                />
              </View>
              <TouchableOpacity onPress={() => setAdditionalFieldsCount((prev) => prev + 1)}>
                <Image source={require('../../../assets/images/ic_add_yellow.webp')} style={{ width: 30, height: 30, marginBottom: 15 }} resizeMode='contain' />
              </TouchableOpacity>
            </View>
            {renderAdditionalFields()}
          </>
        )}
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
