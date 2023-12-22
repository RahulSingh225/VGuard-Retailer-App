import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from '../../../../../../colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { getTicketHistory } from '../../../../../utils/apiservice';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TicketItem {
  createdDate: string;
  name: string;
  status: string;
  ticketNo: string;
}

const TicketHistory: React.FC = () => {
  const [data, setData] = useState<TicketItem[]>([]);
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({
    userName: '',
    userId: '',
    userCode: '',
    userImage: '',
    userRole: '',
  });
  const { t } = useTranslation();
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
    getTicketHistory()
      .then(response => response.json())
      .then((responseData: TicketItem[]) => {
        setData(responseData);
        console.log("<><<><<><>><", responseData, "<><<<><><><><><><<><");
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (index) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  return (
    <ScrollView style={styles.container}>
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
      {data.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>{t('strings:no_data')}</Text>
        </View>
      ) : (
        data.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{item.createdDate}</Text>
              <Text style={styles.messageText}>{item.name}</Text>
              <TouchableOpacity  onPress={() => toggleRow(index)}>
                <Image resizeMode='contain' style={{ height: 20, width: 20 }} source={require('../../../../../assets/images/ic_ticket_drop_down2.png')} />
              </TouchableOpacity>
              <View style={styles.statusContainer}>
                <Text style={styles.status}>{item.status}</Text>
              </View>
            </View>
            {expandedRows.includes(index) && (
              <View style={styles.expandedContent}>
                <Text style={styles.messageText}>Ticket NO.: {item.ticketNo}</Text>
                <Text style={styles.messageText}>Status: {item.status}</Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.white,
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: responsiveFontSize(2),
    color: colors.grey,
    fontWeight: 'bold',
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 10,
  },
  listItem: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  messageContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    fontSize: responsiveFontSize(1.6),
    textAlign: 'left',
    color: colors.black,
  },
  expandedContent: {
    backgroundColor: colors.lightYellow,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5
  },
  status: {
    backgroundColor: colors.yellow,
    color: colors.black,
    padding: 5,
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    borderRadius: 5,
  },
  downImage: {
    height: responsiveFontSize(2),
    width: responsiveFontSize(2),
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
});

export default TicketHistory;
