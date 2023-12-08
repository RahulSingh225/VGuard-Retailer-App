import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import colors from '../../../../../../../colors';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Buttons from '../../../../../../components/Buttons';
import { useNavigation } from '@react-navigation/native';
import cameraIcon from '../../../../../../assets/images/ic_scan_code_camera.webp'
import arrowIcon from '../../../../../../assets/images/arrow.png';
import NeedHelp from '../../../../../../components/NeedHelp';
import getLocation from '../../../../../../utils/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  captureSale,
  getBonusPoints,
  sendCouponPin,
} from '../../../../../../utils/apiservice';
import ScratchCard from '../../../../../../components/ScratchCard';
import { scanQR } from 'react-native-simple-qr-reader';
import Popup from '../../../../../../components/Popup';
import PopupWithOkAndCancel from '../../../../../../components/PopupWithOkAndCancel';
import PopupWithPin from '../../../../../../components/PopupWithPin';
interface ScanCodeProps {
  navigation: any;
  route: any;
}

const ScanCode: React.FC<ScanCodeProps> = ({ navigation, route }) => {
  const type = null;
  const { t } = useTranslation();
  const [qrCode, setQrcode] = useState<string>('');
  const [scratchCard, showScratchCard] = useState<boolean>(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isOkPopupVisible, setOkPopupVisible] = useState(false);
  const [isPinPopupVisible, setPinPopupVisible] = useState(true);
  const [popupContent, setPopupContent] = useState('');
  const [okPopupContent, setOkPopupContect] = useState('');
  const [UserData, setUserData] = useState({
    mobileNo: ''
  });
  const [CouponData, setCouponData] = useState({
    userMobileNumber: '',
    couponCode: '',
    pin: '',
    smsText: '',
    from: '',
    userType: '',
    userId: 0,
    apmID: 0,
    retailerCoupon: false,
    userCode: '',
    isAirCooler: 0,
    latitude: '',
    longitude: '',
    geolocation: '',
    category: '',
  })
  var USER: any = null;

  useEffect(() => {
    AsyncStorage.getItem("USER").then(r => {
      USER = JSON.parse(r || '');
      setUserData(USER);
      setCouponData((prevData) => ({
        ...prevData,
        userMobileNumber: USER?.mobileNo,
      }))
      getUserLocation();
    })
  }, []);

  const getUserLocation = async () => {
    const position = await getLocation();
    
    console.log("Position:", position);
  }


  async function sendBarcode() {
    if (qrCode && qrCode != '') {
      const position = await getLocation();
      var apiResponse;

      console.log(position);
      setCouponData((prevData) => ({
        ...prevData,
        latitude: "99",
        longitude: "99",
        couponCode: qrCode,
        from: 'APP',
        userMobileNumber: UserData?.mobileNo,
        geolocation: ""
      }))

      if (type == 'airCooler') {
        apiResponse = await isValidBarcode(CouponData, 1, '', 0, null);
        const r = await apiResponse.json();
        console.log("Response:", r);
      } else if (type == 'fan') {
        navigation.navigate('Product Registration');
      } else {
        apiResponse = await isValidBarcode(CouponData, 0, '', 0, null);
        const r = await apiResponse.json();
        console.log("Response-----:", r);
        if (r.errorCode == 1) {
          setQrcode('');
          showScratchCard(true);
        }
        else if (r.errorCode == 2) {
          setPinPopupVisible(true);
        }
        else if (r.errorMsg && r.errorMsg != "") {
          setPopupVisible(true);
          setPopupContent(r.errorMsg);
        }
        else {
          setPopupVisible(true);
          setPopupContent(t('strings:something_wrong'));
        }
      }
    }
    else {
      setPopupVisible(true);
      setPopupContent("Please enter Coupon Code or Scan a QR");
    }
  }

  const scan = async () => {
    scanQR()
      .then((result) => {
        setQrcode(result);
        console.log(qrCode)
        return result;
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
  }

  const sendPin = (pin: string) => {
    const mobileNumber = UserData.mobileNo;
  
    setCouponData((prevCouponData) => ({
      ...prevCouponData,
      userMobileNumber: mobileNumber,
      latitude: "99",
      longitude: "99",
      couponCode: qrCode,
      from: 'APP',
      geolocation: "",
      pin: pin,
    }));
  
    sendCouponPin(CouponData)
      .then((result) => result.json())
      .then((jsonResult) => {
        console.log("CouponData:", CouponData);
  
        setPinPopupVisible(false);
        setPopupVisible(true);
        setPopupContent(jsonResult.errorMsg);
      })
      .catch((error) => {
        setPinPopupVisible(false);
        setPopupVisible(true);
        setPopupContent(t('strings:something_wrong'));
        console.error('Send Coupon PIN API Error:', error);
      });
  };
  
  
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.mainWrapper}>
        {scratchCard && (
          <ScratchCard
            points={'40'}
            onPress={() => {
              showScratchCard(false);
            }}
          />
        )}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../../../../assets/images/ic_scan_code_2.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>
        <View style={[{ height: responsiveHeight(5), width: '100%' }]}>
          <Buttons
            label={t('strings:click_here_to_scan_a_unique_code')}
            variant="blackButton"
            onPress={() => scan()}
            width="100%"
            iconHeight={30}
            iconWidth={30}
            iconGap={30}
            icon={cameraIcon}
          />
        </View>
        <Text style={styles.text}>{t('strings:or')}</Text>
        <View style={styles.enterCode}>
          <View style={styles.topContainer}>
            <Text style={styles.smallText}>{t('strings:enter_code')}</Text>
          </View>
          <View style={styles.bottomContainer}>
            <TextInput
              value={qrCode}
              style={styles.input}
              placeholder={t('strings:enter_code_here')}
              placeholderTextColor={colors.grey}
              textAlign="center"
              onChangeText={(text) => setQrcode(text)}
            />
          </View>
        </View>
        <Buttons
          label={t('strings:proceed')}
          variant="filled"
          onPress={async () => await sendBarcode()}
          width="100%"
          iconHeight={10}
          iconWidth={30}
          iconGap={30}
          icon={arrowIcon}
        />
        <View style={styles.rightText}>
          <Text style={styles.smallText}>
            {t('strings:go_to_unique_code_history')}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Unique Code History')}>
            <Image
              style={{ width: 30, height: 30 }}
              source={require('../../../../../../assets/images/ic_circle_right_arrow_yellow.webp')}
            />
          </TouchableOpacity>
        </View>
        <NeedHelp />
      </View>
      {isPopupVisible && (
        <Popup isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}>
          {popupContent}
        </Popup>
      )}
      {isOkPopupVisible && (
        <PopupWithOkAndCancel isVisible={isOkPopupVisible} onClose={() => setOkPopupVisible(false)} onOk={() => console.log("OKKKKKKKK")}>
          {okPopupContent}
        </PopupWithOkAndCancel>
      )}
      {isPinPopupVisible && (
        <PopupWithPin isVisible={isPinPopupVisible} onClose={() => setPinPopupVisible(false)} onOk={(pin) => sendPin(pin)} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  mainWrapper: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: colors.white,
    height: '100%',
    gap: 10,
  },
  header: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    height: responsiveHeight(20),
  },
  text: {
    color: colors.black,
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  smallText: {
    textAlign: 'center',
    color: colors.black,
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
  enterCode: {
    width: '100%',
    borderColor: colors.lightGrey,
    borderWidth: 2,
    borderRadius: 10,
    height: responsiveHeight(10),
    display: 'flex',
    flexDirection: 'column',
  },
  topContainer: {
    borderBottomWidth: 2,
    borderColor: colors.lightGrey,
    padding: 10,
    height: responsiveHeight(5),
    flexGrow: 1,
  },
  bottomContainer: {
    flexGrow: 1,
    height: responsiveHeight(5),
  },
  input: {
    padding: 10,
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    color: colors.black,
    fontWeight: 'bold',
  },
  rightText: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

async function isValidBarcode(
  CouponData: any,
  isAirCooler: number,
  pinFourDigit: string,
  isPinRequired: number,
  dealerCategory: any,
) {
  var result = null;
  CouponData.isAirCooler = isAirCooler;
  if (dealerCategory) {
    CouponData.dealerCategory = dealerCategory;
  }
  if (pinFourDigit == '') {
    result = await captureSale(CouponData);
    console.log(CouponData);
    return result;
  } else {
    CouponData.pin = pinFourDigit;
    result = await sendCouponPin(CouponData);
    return result;
  }
}

export default ScanCode;
