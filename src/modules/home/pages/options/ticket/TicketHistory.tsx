import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from '../../../../../../colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { getTicketHistory } from '../../../../../utils/apiservice';
import { useTranslation } from 'react-i18next';

interface TicketItem {
  createdDate: string;
  name: string;
  status: string;
}

const TicketHistory: React.FC = () => {
  const [data, setData] = useState<TicketItem[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
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

  return (
    <ScrollView style={styles.container}>
      {data.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>{t('strings:no_data')}</Text>
        </View>
      ) : (
        data.map((item, index) => (
          <TouchableOpacity key={index} style={styles.listItem}>
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{item.createdDate}</Text>
              <Text style={styles.messageText}>{item.name}</Text>
              <View style={styles.statusContainer}>
                {/* <Image style={styles.downImage} source={require('../../../../../assets/images/ic_ticket_drop_donw1.png')} /> */}
                <Text style={styles.status}>{item.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
