
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import NeedHelp from '../../../components/NeedHelp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../../../colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useTranslation } from 'react-i18next';
import { getFile } from '../../../utils/apiservice';
import CustomTouchableOption from '../../../components/CustomTouchableOption';
interface User {
  userCode: string;
  name: string;
  selfieImage: string;
  userRole: string;
  pointsBalance: string;
  redeemedPoints: string;
  numberOfScan: string;
}

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState('');

  const loadUserDetails = async () => {
    try {
      const userString = await AsyncStorage.getItem('USER');
      if (userString) {
        const user = JSON.parse(userString);
        const shapedUser = {
          name: user?.name || '',
          userCode: user?.userCode || '',
          selfieImage: user?.kycDetails?.selfie || '',
          userRole: user?.roleId || 0,
          pointsBalance: user?.pointsSummary?.pointsBalance || 0,
          redeemedPoints: user?.pointsSummary.redeemedPoints || 0,
          numberOfScan: user?.pointsSummary.numberOfScan || 0
        };
        setUserData(shapedUser);
      }
    } catch (error) {
      console.error('Error retrieving user details:', error);
    }
  };



  useEffect(() => {
    loadUserDetails();
  }, []);
  useEffect(() => {
    console.log(userData, "userData=================")
    if (userData?.userRole && userData.selfieImage) {
      const getImage = async () => {
        try {
          const profileImage = await getFile(userData.selfieImage, 'PROFILE', 2);
          setProfileImage(profileImage.url);
          console.log(profileImage.url, "<><><<>Image")
        } catch (error) {
          console.log('Error while fetching profile image:', error);
        }
      };

      getImage();
    }
  }, [userData?.userRole, userData?.selfieImage]);
  return (
    <ScrollView style={styles.mainWrapper}>
      <View style={styles.detailContainer}>
        <View style={styles.ImageProfile}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../../assets/images/ic_v_guards_user.png')}
            style={{ width: '100%', height: '100%', borderRadius: 100 }}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text style={styles.name}>{userData?.name}</Text>
          <Text style={styles.code}>{userData?.userCode}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.viewProfile}>{t('strings:view_profile')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.points}>
          <View style={styles.leftPoint}>
            <Text style={styles.greyText}>{t('strings:points_balance')}</Text>

            <Text style={styles.point}>{userData?.pointsBalance ? userData?.pointsBalance : 0}</Text>
          </View>
          <View style={styles.middlePoint}>
            <Text style={styles.greyText}>{t('strings:points_redeemed')}</Text>
            <Text style={styles.point}>
              {userData?.redeemedPoints ? userData?.redeemedPoints : 0}
            </Text>
          </View>
          <View style={styles.rightPoint}>
            <Text style={styles.greyText}>{t('strings:number_of_scans')}</Text>
            <Text style={styles.point}>{userData?.numberOfScan}</Text>

          </View>
        </View>
        <View style={styles.dashboard}>
          <View style={styles.row}>
            <CustomTouchableOption
              text="strings:scan_code"
              iconSource={require('../../../assets/images/ic_scan_code.png')}
              screenName="Scan QR"
            />
            <CustomTouchableOption
              text="strings:redeem_points"
              iconSource={require('../../../assets/images/ic_redeem_points.webp')}
              screenName="Redeem Products"
            />
            <CustomTouchableOption
              text="strings:dashboard"
              iconSource={require('../../../assets/images/ic_dashboard.webp')}
              screenName="Dashboard"
            />
          </View>
          <View style={styles.row}>
            <CustomTouchableOption
              text="strings:update_pan"
              iconSource={require('../../../assets/images/ic_update_kyc.webp')}
              screenName="Update KYC"
              disabled = {true}
            />
            <CustomTouchableOption
              text="strings:scheem_offers"
              iconSource={require('../../../assets/images/ic_scheme_offers.png')}
              screenName="schemes"
            />
            <CustomTouchableOption
              text="strings:info_desk"
              iconSource={require('../../../assets/images/ic_vguard_info.webp')}
              screenName="info"
            />
          </View>
          <View style={styles.row}>
            <CustomTouchableOption
              text="strings:air_cooler"
              iconSource={require('../../../assets/images/icon_air_cooler.webp')}
              screenName="Welfare"
            />
            <CustomTouchableOption
              text="strings:what_s_new"
              iconSource={require('../../../assets/images/ic_whats_new.webp')}
              screenName="new"
            />
            <CustomTouchableOption
              text="strings:raise_ticket"
              iconSource={require('../../../assets/images/ic_raise_ticket.webp')}
              screenName="ticket"
            />
          </View>
          <View style={styles.row}>
            <CustomTouchableOption
              text="strings:update_bank"
              iconSource={require('../../../assets/images/ic_raise_ticket.webp')}
              screenName="Update Bank"
            />
            <CustomTouchableOption
              text="strings:tds_certificate"
              iconSource={require('../../../assets/images/tds_ic.png')}
              screenName="TDS Certificate"
            />
            <CustomTouchableOption
              text="strings:engagement"
              iconSource={require('../../../assets/images/elink.png')}
              screenName="Engagement"
            />
          </View>
          <View style={styles.lastrow}>
          <CustomTouchableOption
              text="strings:tds_statement"
              iconSource={require('../../../assets/images/tds_ic.png')}
              screenName="TDS Certificate"
            />
          </View>
        </View>
      <NeedHelp />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    padding: 15,
    flex: 1
  },
  name: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7)
  },
  code: {
    color: colors.black,
    fontSize: responsiveFontSize(1.7)
  },
  viewProfile: {
    color: colors.yellow,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7),
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20
  },
  ImageProfile: {
    height: 50,
    width: 50,
    backgroundColor: colors.lightGrey,
    borderRadius: 100,
  },
  points: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginTop: 30,
  },
  leftPoint: {
    width: responsiveWidth(30),
    height: responsiveHeight(15),
    backgroundColor: colors.lightYellow,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middlePoint: {
    width: responsiveWidth(30),
    height: responsiveHeight(15),
    backgroundColor: colors.lightYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightPoint: {
    width: responsiveWidth(30),
    height: responsiveHeight(15),
    backgroundColor: colors.lightYellow,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greyText: {
    width: '80%',
    color: colors.grey,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 10,
  },
  point: {
    fontWeight: 'bold',
    color: colors.black,
    fontSize: responsiveFontSize(1.7),
  },
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 30,
    marginTop: 30,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-around',
  },
  lastrow: {
    marginLeft: 5,
  },
  oval: {
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(18),
    width: responsiveWidth(25),
    maxWidth: responsiveWidth(25),
    flexGrow: 1,
    backgroundColor: colors.white,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    borderRadius: 100,
  },
  optionIcon: {
    width: responsiveHeight(5),
    height: responsiveHeight(5),
    marginBottom: 20,
  },
  nav: {
    color: colors.black,
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default HomeScreen;
