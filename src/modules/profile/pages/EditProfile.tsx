import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import colors from '../../../../colors';
import { getFile, getRetailerCategoryDealIn, updateProfile } from '../../../utils/apiservice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { UserData } from '../../../utils/modules/UserData';
import InputField from '../../../components/InputField';
import Buttons from '../../../components/Buttons';
import PickerField from '../../../components/PickerField';
import DatePickerField from '../../../components/DatePickerField';
import Popup from '../../../components/Popup';
import Snackbar from 'react-native-snackbar';


const EditProfile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();

  const baseURL = 'https://www.vguardrishta.com/img/appImages/Profile/';
  const ecardURL = 'https://www.vguardrishta.com/img/appImages/eCard/';

  const [userData, setUserData] = useState<UserData | any>();
  const [postData, setPostData] = useState<UserData | any>();
  const [profileImage, setProfileImage] = useState(null);
  const [isShopAddressDifferent, setIsShopAddressDifferent] = useState('Yes');
  const [retailerCategoryDealIn, setRetailerCategoryDealIn] = useState([]);
  const [idFrontCopySource, setIdFrontCopySource] = useState<string | null>(null);
  const [idBackCopySource, setIdBackCopySource] = useState<string | null>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('USER').then(r => {
      const user = JSON.parse(r || '');
      setUserData(user);
      setPostData(user);
    });
    getRetailerCategoryDealIn()
      .then(response => response.json())
      .then((responseData) => {
        setRetailerCategoryDealIn(responseData);
        console.log("<><<><<><>><", responseData, "<><<<><><><><><><<><");
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

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




  // ... (other imports)

  const handleSubmit = async () => {
    console.log("Post Data:", postData?.dob);

    // Check if dob is less than 18 years
    const currentDate = new Date();
    const dobDate = new Date(postData?.dob);
    const minAllowedDate = new Date(currentDate);
    minAllowedDate.setFullYear(currentDate.getFullYear() - 18);

    if (dobDate < minAllowedDate) {
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
        text: 'The age should be atleast 18 years.',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };


  const handleChange = (label: string, value: string) => {
    if (label == "isShopDifferent") {
      setIsShopAddressDifferent(value)
    }
    else if (label == "maritalStatus") {
      setPostData((prevData: UserData) => ({
        ...prevData,
        [label]: value,
      }));
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
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];
  const shopAddresspickerItems = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ];
  const maritalStatusItems = [
    { label: 'Married', value: 'Married' },
    { label: 'UnMarried', value: 'UnMarried' }
  ];


  return (
    <ScrollView style={styles.mainWrapper}>
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
        />
        <InputField
          label={t('strings:lbl_state')}
          value={postData?.state}
          onChangeText={(text) => handleInputChange(text, 'state')}
        />
        <InputField
          label={t('strings:district')}
          value={postData?.pinCode}
          onChangeText={(text) => handleInputChange(text, 'pinCode')}
        />
        <InputField
          label={t('strings:city')}
          value={postData?.city}
          onChangeText={(text) => handleInputChange(text, 'city')}
        />
        <PickerField
          label={t('strings:is_shop_address_different')}
          disabled={false} // Optional
          selectedValue={isShopAddressDifferent}
          onValueChange={(text: string) => handleChange("isShopDifferent", text)}
          items={shopAddresspickerItems}
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
        <PickerField
          label={t('strings:select_category_you_deal_in')}
          disabled={false}
          selectedValue={postData?.categoryDealIn}
          onValueChange={(text: string) => {
            const selectedCategory = retailerCategoryDealIn.find(category => category.prodCatName === text);

            setPostData((prevData: UserData) => ({
              ...prevData,
              categoryDealIn: text,
              categoryDealInID: selectedCategory?.prodCatId || null, // Set to null if not found
            }));
          }}
          items={retailerCategoryDealIn.map(category => ({ label: category.prodCatName, value: category.prodCatName }))}
        />

        <InputField
          label={t('strings:already_enrolled_into_loyalty_scheme')}
          value={isShopAddressDifferent}
        />
        <InputField
          label={t('strings:annual_business_potential')}
          value={postData?.annualBusinessPotential?.toString()}
          onChangeText={(text) => handleInputChange(text, 'annualBusinessPotential')}
        />
        <InputField
          label={t('strings:selfie')}
          isImage
          imageSource={profileImage}
          onPressImage={() => {
            console.log("Image Pressed")
          }}
        />
        <InputField
          label="ID Proof* (Front)"
          isImage
          imageSource={idFrontCopySource}
          onPressImage={() => {
            console.log("Image Pressed")
          }}
        />
        <InputField
          label="ID Proof* (Back)"
          isImage
          imageSource={idBackCopySource}
          onPressImage={() => {
            console.log("Image Pressed")
          }}
        />
        <InputField
          label={t('strings:id_proof_no')}
          value={postData?.kycDetails?.aadharOrVoterOrDlNo}
          onChangeText={(text) => handleInputChange(text, 'kycDetails?.aadharOrVoterOrDlNo')}
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
