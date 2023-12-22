import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Modal,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import colors from '../../../../../../colors';
import NeedHelp from '../../../../../components/NeedHelp';
import Buttons from '../../../../../components/Buttons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendTicket, getTicketTypes } from '../../../../../utils/apiservice';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getFile, sendFile } from '../../../../../utils/apiservice';
import Snackbar from 'react-native-snackbar';
import { height, width } from '../../../../../utils/dimensions';
import { Button } from 'react-native-paper';
import Popup from '../../../../../components/Popup';

const Ticket: React.FC<{ navigation: any }> = ({ navigation }) => {
  const baseURL =
    'https://www.vguardrishta.com/img/appImages/Profile/';

  const { t } = useTranslation();

  const [userData, setUserData] = useState({
    userName: '',
    userId: '',
    userCode: '',
    userImage: '',
    userRole: '',
  });

  const [profileImage, setProfileImage] = useState(null);

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState('');
  const [entityUid, setEntityUid] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [select, setselect] = useState();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);

  const handleImageClick = () => {
    setShowImagePreviewModal(true);
  };


  const handleImagePickerPress = () => {
    setShowImagePickerModal(true);
  };

  const handleCameraUpload = () => {
    setShowImagePickerModal(false);
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('Camera was canceled');
        } else if (response.error) {
          console.error('Camera error: ', response.error);
        } else {
          const fileData = {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          };
          console.log("URI:===========", response.assets[0].uri)
          setSelectedImage(response.assets[0].uri);
          setSelectedImageName(response.assets[0].fileName);
          triggerApiWithImage(fileData);
        }
      },
    );
  };

  const handleGalleryUpload = () => {
    setShowImagePickerModal(false);
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('Image picker was canceled');
        } else if (response.error) {
          console.error('Image picker error: ', response.error);
        } else {
          const fileData = {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          };
          console.log("URI:===========", response.assets[0].uri)
          setSelectedImage(response.assets[0].uri);
          setSelectedImageName(response.assets[0].fileName);
          triggerApiWithImage(fileData);
        }
      },
    );
  };

  const triggerApiWithImage = async (fileData) => {
    const formData = new FormData();
    formData.append('USER_ROLE', "2");
    formData.append('image_related', 'TICKET');
    formData.append('file', fileData);

    console.log("------------------", fileData)

    try {
      const response = await sendFile(formData);
      console.log("response of image--------", response)
      setEntityUid(response.data.entityUid);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('USER').then((r) => {
      const user = JSON.parse(r);
      const data = {
        userName: user.name,
        userCode: user.userCode,
        pointsBalance: user.pointsSummary.pointsBalance,
        redeemedPoints: user.pointsSummary.redeemedPoints,
        userImage: user.kycDetails.selfie,
        userRole: user.professionId,
        userId: user.contactNo
      };
      setUserData(data);
    });
    getTicketTypes()
      .then((response) => response.json())
      .then((data) => {
        setOptions(data);
        setIsOptionsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
        setIsOptionsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (userData.userRole && userData.userImage) {
      const getImage = async () => {
        try {
          const profileImageUrl = await getFile(userData.userImage, 'PROFILE', 2);
          if (profileImageUrl.status === 500) {
            setProfileImage(null);
          }
          else {
            setProfileImage(profileImageUrl.url);
          }
          console.log(profileImage)
        } catch (error) {
          console.log('Error while fetching profile image:', error);
        }
      };

      getImage();
    }
  }, [userData.userRole, userData.userImage]);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const openTnC = () => {
    Linking.openURL('https://vguardrishta.com/tnc_retailer.html');
  };

  const openFaqS = () => {
    Linking.openURL(
      'https://vguardrishta.com/frequently-questions-retailer.html',
    );
  };

  const handleSubmission = async () => {
    const postData = {
      userId: userData.userId,
      issueTypeId: selectedOption,
      imagePath: entityUid,
      description: descriptionInput,
    };

    console.log("Post Data========", postData)

    if (postData.userId != '' && postData.issueTypeId != '' && postData.imagePath != '' && postData.description != '') {
      sendTicket(postData)
        .then((response) => {
          if (response.status === 200) {
            setSelectedOption('');
            setSelectedImage(null);
            setSelectedImageName('');
            setEntityUid('');
            setDescriptionInput('');
            // showSnackbar('Ticket Created Successfully');
            setPopupContent('Ticket Created Successfully');
            setPopupVisible(true);
          } else {
            setPopupContent('Failed to create ticket');
            setPopupVisible(true);
            throw new Error('Failed to create ticket');
          }
        })
        .catch((error) => {
          setPopupContent('Failed to create ticket');
          setPopupVisible(true);
          console.error('API Error:', error);
        });
    }
    else {
      setPopupContent('Enter All Details');
      setPopupVisible(true);
    }
  };

  return (
    <ScrollView style={styles.mainWrapper}>
      <View style={styles.flexBox}>
        <View style={styles.profileDetails}>
          <View style={styles.ImageProfile}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: 100 }} resizeMode='contain' />
            ) : (
              <Image source={require('../../../../../assets/images/ic_v_guards_user.png')} style={{ width: '100%', height: '100%', borderRadius: 100 }} resizeMode='contain' />
            )}
          </View>
          <View style={styles.profileText}>
            <Text style={styles.textDetail}>{userData.userName}</Text>
            <Text style={styles.textDetail}>{userData.userCode}</Text>
          </View>
        </View>
        <TouchableHighlight
          style={styles.button}
          onPress={() => navigation.navigate('Ticket History')}
        >
          <Text style={styles.buttonText}>
            {t('strings:ticket_history')}
          </Text>
        </TouchableHighlight>
      </View>
      <Text style={styles.blackText}>{t('strings:issue_type')}</Text>
      {isOptionsLoading ? (
        <Text style={styles.blackText}>Loading options...</Text>
      ) : options.length === 0 ? (
        <Text style={styles.blackText}>No options available.</Text>
      ) : (
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={selectedOption}
            onValueChange={handleOptionChange}
            style={styles.picker}
            label={t('strings:select_ticket_type')}
          >
            <Picker.Item
              key={''}
              label={'Select Issue Type'}
              value={''}
            />
            {options.map((option) => (
              <Picker.Item
                key={option.issueTypeId}
                label={option.name}
                value={option.issueTypeId}
              />
            ))}
          </Picker>
        </View>
      )}
      <TouchableOpacity
        onPress={handleImagePickerPress}
        style={styles.inputContainer}
      >

        {selectedImage ? (
          <TextInput
            style={styles.input}
            placeholder={selectedImageName}
            placeholderTextColor={colors.grey}
            editable={false}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder={t('strings:upload_picture_optional')}
            placeholderTextColor={colors.grey}
            editable={false}
          />
        )}
        <TouchableOpacity
          onPress={handleImageClick}>
          <View style={styles.inputImage}>
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require('../../../../../assets/images/photo_camera.png')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Modal for selecting camera or gallery */}
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
            <Image resizeMode='contain' style={{width: 50, height: 50}} source={require('../../../../../assets/images/ic_close.png')} />
          </TouchableOpacity>

          <Image
            source={{ uri: selectedImage }}
            style={{ width: '70%', height: '70%'}}
            resizeMode="contain"
          />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showImagePickerModal}
        style={styles.modalcontainer}
        hardwareAccelerated={true}
        opacity={0.3}
      >
        <View
          style={{
            width: width / 1.80,
            borderRadius: 5,
            alignSelf: 'center',
            height: height / 8,
            top: height / 2.8,
            margin: 20,
            backgroundColor: '#D3D3D3',
            borderRadius: 20,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 100,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Picker
            mode="dropdown"
            placeholder={'Update Your Selfie *'}
            style={{ color: 'black' }}
            selectedValue={select}
            onValueChange={(itemValue, itemIndex) => {
              if (itemValue === 'Open camera') {
                handleCameraUpload();
              } else if (itemValue === 'Open Image picker') {
                handleGalleryUpload();
              }
            }}
          >
            <Picker.Item label="Select Action" value="" />
            <Picker.Item
              label="Select Photo from gallery"
              value="Open Image picker"
            />
            <Picker.Item
              label="Capture Photo from camera"
              value="Open camera"
            />
          </Picker>
          <Button mode="text" onPress={() => setShowImagePickerModal(false)}>
            Close
          </Button>
        </View>
      </Modal>

      <Text style={styles.blackText}>{t('strings:description_remarks')}</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder={t('strings:provide_description_in_the_box')}
        placeholderTextColor={colors.grey}
        multiline={true}
        textAlignVertical="top"
        value={descriptionInput}
        onChangeText={(text) => setDescriptionInput(text)}
      />

      <Buttons
        label={t('strings:submit')}
        variant="filled"
        onPress={handleSubmission}
        width="100%"
      />
      <View style={styles.footerRow}>
        <View style={styles.hyperlinks}>
          <TouchableOpacity style={styles.link} onPress={openTnC}>
            <Image
              style={{
                height: 30,
                width: 30
              }}
              resizeMode='contain'
              source={require('../../../../../assets/images/ic_tand_c.png')} />
            <Text style={styles.linkText}>
              {t('strings:terms_and_conditions')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={openFaqS}>
            <Image
              style={{
                height: 30,
                width: 30
              }}
              resizeMode='contain'
              source={require('../../../../../assets/images/ic_faq.png')} />
            <Text style={styles.linkText}>
              {t('strings:frequently_asked_quetions_faq')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <NeedHelp />
        </View>
      </View>
      {isPopupVisible && (
        <Popup isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}>
          {popupContent}
        </Popup>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  footer: {
    marginBottom: 40
  },
  picker: {
    color: colors.black,
    // backgroundColor: colors.grey,
    height: responsiveHeight(5),
    width: '100%',
    fontSize: responsiveFontSize(1.5)
  },
  mainWrapper: {
    padding: 15,
    flexGrow: 1,
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    fontSize: responsiveFontSize(1.7),
  },
  ImageProfile: {
    height: 50,
    width: 50,
    borderRadius: 100
  },
  textDetail: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7)
  },
  buttonText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5)
  },
  button: {
    backgroundColor: colors.yellow,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1),
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    borderRadius: 5
  },
  inputContainer: {
    borderColor: colors.lightGrey,
    borderWidth: 2,
    borderRadius: 10,
    height: responsiveHeight(5),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1)
  },
  input: {
    width: '90%',
    padding: 10,
    fontSize: responsiveFontSize(1.8),
    color: colors.black,
    fontWeight: 'bold'
  },
  descriptionInput: {
    width: '100%',
    height: responsiveHeight(20),
    borderColor: colors.lightGrey,
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    fontSize: responsiveFontSize(1.8),
    color: colors.black,
    fontWeight: 'bold',
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(2)
  },
  inputImage: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
    marginRight: 5
  },
  blackText: {
    color: colors.black,
    fontWeight: 'bold',
    marginTop: responsiveHeight(2),
  },
  hyperlinks: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '40%',
    marginRight: 25,
    marginTop: responsiveHeight(1)
  },
  footerRow: {
    flexDirection: 'row'
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(1.7)
  },
  link: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5
  },
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

})

export default Ticket