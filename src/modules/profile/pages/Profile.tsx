import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableHighlight, Image, Linking, TouchableOpacity, Modal } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import colors from '../../../../colors';
import { getFile, getRishtaUserProfile } from '../../../utils/apiservice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { UserData } from '../../../utils/modules/UserData';
import InputField from '../../../components/InputField';
import Popup from '../../../components/Popup';

const Profile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();

  const baseURL = 'https://www.vguardrishta.com/img/appImages/Profile/';
  const ecardURL = 'https://www.vguardrishta.com/img/appImages/eCard/';

  const [userData, setUserData] = useState<UserData | any>();
  const [profileImage, setProfileImage] = useState(null);
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [gstImageName, setGstImageName] = useState("");
  const [frontFacadeImageName, setFrontFacadeImageName] = useState("");
  const [chequeImageName, setChequeImageName] = useState("");
  const [imageOpen, setimageOpen] = useState("")
  const handleImageClick = (imageSource: string | "") => {
    console.log("opening model")
    setShowImagePreviewModal(true);
    setimageOpen(imageSource);
  };
  useEffect(() => {
    // AsyncStorage.getItem('USER').then(r => {
    //   const user = JSON.parse(r || '');
    //   setUserData(user);
    // });
    getRishtaUserProfile().then(response => response.json()
      .then(res => {
        const result = res;
        console.log(result)
        setUserData(result);
      }))
  }, []);
  const fetchChequeCopy = async () => {
    try {
      const source = await renderField("Cancelled Cheque Copy");
      setChequeCopySource(source);
      const gstSource = await renderField("GST Photo");
      setGstCopySource(gstSource);
    } catch (error) {
      console.error("Error fetching cheque copy:", error);
    }
  };
  useEffect(() => {
    fetchChequeCopy();
  }, [userData?.roleId, userData?.kycDetails?.selfie]);
  useEffect(() => {
    if (userData?.roleId && userData?.kycDetails?.selfie) {
      const getImage = async () => {
        try {
          const profileImageUrl = await getFile(userData.kycDetails.selfie, 'PROFILE', "2");
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
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');

  const openReferralPopop = () => {
    setPopupVisible(true);
    setPopupContent("Coming Soon!")
  }

  const labels = [
    // 'Preferred Language',
    'Contact Number',
    'Store/Firm Name',
    // 'Front Facade',
    // 'GST Photo',
  ];
  const label2 = [
    'Date of Birth',
    'Email'
  ]

  const addressLabels = [
    'Permanent Address House/Flat/Block No.',
    'Street/Colony/Locality Name',
    'Landmark',
    'State',
    'Distict',
    'City',
    'Pincode',
    'Marital Status',
    'Annual Business Potential'
  ]

  const bankDetails = [
    'Account Number',
    'Account Holder Name',
    'Bank Name',
    'IFSC Code',
    // 'Cancelled Cheque Copy'
  ]

  const renderField = async (fieldName: string): string => {
    if (fieldName === 'Cancelled Cheque Copy') {
      const checkPhoto = userData.bankDetail.checkPhoto
      setChequeImageName(checkPhoto)
      console.log("CHECK ", checkPhoto)
      const chequePhoto = await getFile(checkPhoto, 'CHEQUE', "2");
      const url = chequePhoto.url
      return url;
    }
    if (fieldName === 'GST Photo') {
      const gstFront = userData.kycDetails.gstFront;
      setGstImageName(gstFront)
      const gstPhoto = await getFile(gstFront, 'GST', "2");
      const url = gstPhoto.url
      return url;
    }
    const fieldMap: Record<string, string> = {
      'Date of Birth': 'dob',
      'Contact Number': 'contactNo',
      'Email': 'emailId',
      'Store/Firm Name': 'firmName',
      'Permanent Address House/Flat/Block No.': 'permanentAddress',
      'Street/Colony/Locality Name': 'streetAndLocality',
      'Landmark': 'currLandmark',
      'State': 'state',
      'Distict': 'dist',
      'City': 'city',
      'Pincode': 'pinCode',
      'Marital Status': 'maritalStatus',
      'Annual Business Potential': 'annualBusinessPotential',
      'Account Number': 'bankDetail.bankAccNo',
      'Account Holder Name': 'bankDetail.bankAccHolderName',
      'Bank Name': 'bankDetail.bankNameAndBranch',
      'IFSC Code': 'bankDetail.bankIfsc',
      'GST Photo': 'kycDetails.gstFront',
    };


    if (fieldName in fieldMap) {
      const mappedField = fieldMap[fieldName];
      const fieldValue = mappedField.split('.').reduce((obj, key) => obj[key], userData);
      if (fieldName === 'Marital Status') {
        return fieldValue == 1 ? 'Married' : fieldValue == 2 ? 'Unmarried' : '';
      }
      const formattedValue =
        typeof fieldValue === 'number' ? fieldValue.toString() : fieldValue;
      return formattedValue === true ? 'Yes' : formattedValue === false ? 'No' : formattedValue;
    } else {
      return '';
    }
  };

  const openEVisitingCard = () => {
    Linking.openURL(ecardURL + userData.ecardPath);
  };

  const renderFields = async (fieldNames: string[]): Promise<string[]> => {
    const results = await Promise.all(
      fieldNames.map(async (fieldName) => await renderField(fieldName))
    );
    return results;
  };

  const [renderedFields, setRenderedFields] = useState<string[] | null>(null);
  const [renderedBankFields, setRenderedBankFields] = useState<string[] | null>(null);
  const [renderedAddressFields, setRenderedAddressFields] = useState<string[] | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const fields = await renderFields(labels);
      const addressFields = await renderFields(addressLabels);
      const bankFields = await renderFields(bankDetails);
      setRenderedFields(fields);
      setRenderedAddressFields(addressFields);
      setRenderedBankFields(bankFields);
    };

    fetchData();
  }, [userData?.roleId, userData?.kycDetails?.selfie]);

  const [chequeCopySource, setChequeCopySource] = useState<string | null>(null);
  const [gstCopySource, setGstCopySource] = useState<string | null>(null);
  const [frontFacadeCopySource, setFrontFacadeCopySource] = useState<string | null>(null);
  // const [facadeCopySource, setFacadeCopySource] = useState<string | null>(null);

  useEffect(() => {
    const fetchChequeCopy = async () => {
      try {
        const source = await renderField("Cancelled Cheque Copy");
        const gstSource = await renderField("GST Photo");
        setChequeCopySource(source);
        setGstCopySource(gstSource);
      } catch (error) {
        console.error("Error fetching cheque copy:", error);
      }
    };

    fetchChequeCopy();
  }, []);

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
      <View style={styles.buttons}>
        <TouchableHighlight
          style={styles.button}
          onPress={() => navigation.navigate('Edit Profile')}
        >
          <Text style={styles.buttonText}>{t('strings:edit_profile')}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={() => navigation.navigate('Add Sub-Login')}
        >
          <Text style={styles.buttonText}>{t('strings:add_sub_login')}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={() => openReferralPopop()}
        >
          <Text style={styles.buttonText}>{t('strings:referral_code')}</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.detailsContainer}>
        {labels.map((label, index) => (
          <InputField
            key={index}
            label={label}
            value={renderedFields ? renderedFields[index] : ''}
            disabled={true}
            isImage={false}
          />
        ))}
        {/* <InputField
          label="Front Facade"
          isImage
          imageSource={facadeCopySource}
          onPressImage={() => {
            console.log("Image Pressed")
          }}
        /> */}
        <InputField
          label="Front Facade"
          isImage
          imageName={gstImageName}
          imageSource={gstCopySource}
          onPressImage={() => handleImageClick(gstCopySource)}
        />
        <InputField
          label="GST Photo"
          isImage
          imageName={frontFacadeImageName}
          imageSource={frontFacadeCopySource}
          onPressImage={() => handleImageClick(frontFacadeCopySource)}
        />
        {label2.map((label, index) => (
          <InputField
            key={index}
            label={label}
            value={renderedFields ? renderedFields[index] : ''}
            disabled={true}
            isImage={false}
          />
        ))}
        
        <Text style={styles.subHeading}>{t('strings:permanent_address')}</Text>
        {addressLabels.map((label, index) => (
          <InputField
            label={label}
            value={renderedAddressFields ? renderedAddressFields[index] : ''}
            disabled={true}
            isImage={false}
          />
        ))}
        <Text style={styles.subHeading}>{t('strings:lbl_bank_details')}</Text>
        {bankDetails.map((label, index) => (
          <InputField
            label={label}
            value={renderedBankFields ? renderedBankFields[index] : ''}
            disabled={true}
            isImage={false}
          />
        ))}
        <InputField
          label="Cancelled Cheque Copy"
          isImage
          imageName={chequeImageName}
          imageSource={chequeCopySource}
          onPressImage={() => handleImageClick(chequeCopySource)}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showImagePreviewModal}
        onRequestClose={() => setShowImagePreviewModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => setShowImagePreviewModal(false)}
          >
            <Image resizeMode='contain' style={{ width: 50, height: 50 }} source={require('../../../assets/images/ic_close.png')} />
          </TouchableOpacity>

          <Image
            source={{ uri: imageOpen }}
            style={{ width: '70%', height: '70%'}}
            resizeMode="contain"
          />
        </View>
      </Modal>
      {isPopupVisible && (
        <Popup isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}>
          {popupContent}
        </Popup>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    gap: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
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
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    backgroundColor: colors.yellow,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1),
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    borderRadius: 5,
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20
  },
  buttonText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5),
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
  }
});

export default Profile;
