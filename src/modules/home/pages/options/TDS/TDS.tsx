import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import colors from '../../../../../../colors';
import { getAy } from '../../../../../utils/apiservice';
import Loader from '../../../../../components/Loader';

interface TDSProps {}

const TDS: React.FC<TDSProps> = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([])
  const [loader, showLoader] = useState(false);

  const handleDownload = () => {
    console.log("Pressed")
  };

  useEffect(() => {
    showLoader(true);
    
    getAy().then(async (response) => {
      console.log(response);
      const result = await response.json();
      setData(result);
      showLoader(false);
    });
  }, []);

  return (
    <View style={styles.mainWrapper}>
      <Text style={styles.greyText}>Select Assessment Year</Text>
      {loader && <Loader />}
      {data.map((item, index) => (
        <View style={styles.card} key={index}>
          <Text style={styles.yearText}>{item}</Text>
          <TouchableOpacity onPress={() => handleDownload()}>
            <Image
              style={styles.downImage}
              source={require('../../../../../assets/images/ic_ticket_drop_down2.png')}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    color: colors.black,
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  mainWrapper: {
    padding: 15,
  },
  greyText: {
    color: colors.grey,
    textAlign: 'center',
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  yearText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: colors.black,
  },
  downImage: {
    height: responsiveFontSize(2.5),
    width: responsiveFontSize(2.5),
  },
});

export default TDS;
