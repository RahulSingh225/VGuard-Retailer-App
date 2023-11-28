import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import colors from '../../../../colors';
import Buttons from '../../../components/Buttons';
import arrowIcon from '../../../assets/images/arrow.png';
import { Newuserotpvalidation } from '../../../utils/apiservice';
import Popup from '../../../components/Popup';
import Loader from '../../../components/Loader';

interface LoginWithOtpProps {
  navigation: any;
  route: {
    params: {
      usernumber: string;
      jobprofession: string;
      preferedLanguage: number;
    };
  };
}

const LoginWithOtp: React.FC<LoginWithOtpProps> = ({ navigation, route }) => {
  const { usernumber, jobprofession, preferedLanguage } = route.params;

  console.log('====>>>>', usernumber);
  console.log('====>>>>', jobprofession);
  console.log('====>>>>', preferedLanguage);
  const [otp, setOtp] = useState('');
  const [number, setnumber] = useState(usernumber);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const placeholderColor = colors.grey;

  async function validateotp() {
    try {
      if (!otp) {
        setIsPopupVisible(true);
        setPopupMessage('Please Enter the otp to proceed ');
      } else {
        const verification = await Newuserotpvalidation(number, otp);
        const successMessage = verification.data.message;
        console.log(successMessage);
        if (
          successMessage ===
          'OTP verified successfully, please proceed with the registration.'
        ) {
          setPopupMessage(successMessage);
          setIsPopupVisible(true);
          setTimeout(() => {
            navigation.navigate('newUser', {
              passedNo: number,
              jobprofession: jobprofession,
              preferedLanguage: preferedLanguage,
            });
          }, 1200);
        } else {
          setIsPopupVisible(true);
          setPopupMessage(verification.data.message);
        }
      }
    } catch (error) {
      console.log('=====+++>>>>', error);
    } finally {
    }
  }

  useEffect(() => {}, [otp, number]);

  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.registerUser}>
        {isLoading == true ? (
          <View style={{ flex: 1 }}>
            <Loader isLoading={isLoading} />
          </View>
        ) : null}
        <View style={styles.mainWrapper}>
          <Image
            source={require('../../../assets/images/group_907.png')}
            style={styles.imageSaathi}
          />
          <Text style={styles.mainHeader}>
            {t('strings:lbl_otp_verification')}
          </Text>
          <View style={styles.formContainer}>
            <View style={styles.containter}>
              {isPopupVisible && (
                <Popup
                  isVisible={isPopupVisible}
                  onClose={() => setIsPopupVisible(false)}>
                  <Text>{popupMessage}</Text>
                </Popup>
              )}
              <Text style={styles.textHeader}>
                {t('strings:enter_otp_description')}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t('strings:enter_otp')}
                placeholderTextColor={placeholderColor}
                keyboardType="number-pad"
                value={otp}
                onChangeText={(text) => setOtp(text)}
                maxLength={4}
              />
            </View>
            <View>
              <Buttons
                label={t('strings:submit')}
                variant="filled"
                onPress={() => validateotp()}
                width="100%"
                iconHeight={10}
                iconWidth={30}
                iconGap={30}
                icon={arrowIcon}
              />
            </View>
            <Text style={styles.or}>{t('strings:or')}</Text>
            <View style={styles.otpPhone}>
              <Image
                source={require('../../../assets/images/group_501.png')}
                style={styles.phone}
              />
              <Text style={styles.greyText}>
                {t('strings:call_to_get_otp')}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <View style={styles.footerContainer}>
            <Text style={styles.footergreyText}>
              {t('strings:powered_by_v_guard')}
            </Text>
            <Image
              source={require('../../../assets/images/group_910.png')}
              style={styles.imageVguard}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  registerUser: {
    height: '100%',
    backgroundColor: colors.white,
    display: 'flex',
  },
  mainWrapper: {
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
  },
  textHeader: {
    textAlign: 'center',
    width: '80%',
    color: colors.grey,
    fontSize: 14,
    fontWeight: 'bold',
  },
  mainHeader: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 10
  },
  imageSaathi: {
    width: 100,
    height: 98,
    marginBottom: 30,
  },
  imageVguard: {
    width: 100,
    height: 36,
  },
  formContainer: {
    width: '100%',
    padding: 16,
    flex: 2,
  },
  input: {
    height: 40,
    width: '100%',
    padding: 10,
    borderRadius: 5,
    color: colors.black,
    backgroundColor: colors.white,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
  },
  or: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 20,
    marginTop: 20,
  },
  footergreyText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.grey,
    paddingBottom: 5,
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    backgroundColor: colors.lightGrey,
    width: '100%',
    paddingVertical: 10,
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  radioButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    alignItems: 'center',
  },
  containter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    marginBottom: 50,
  },
  phone: {
    height: 50,
    width: 50,
  },
  greyText: {
    fontSize: 14,
    color: colors.grey,
  },
  otpPhone: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 50,
    justifyContent: 'center',
  },
});

export default LoginWithOtp;
