import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { useTranslation } from 'react-i18next';
import colors from '../../../../../../colors';
import { getFiscalYear, getMonth } from '../../../../../utils/apiservice';
import Loader from '../../../../../components/Loader';

interface TDSProps {}

const CustomMonthDropdown: React.FC<{ data: any[]; value: string; onChange: (item: any) => void }> = ({ data, value, onChange }) => {
  return (
    <FlatList
      style={styles.dropdown}
      data={data}
      keyExtractor={(item) => item.value}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onChange(item)}>
          <Text style={styles.dropdownItem}>{item.month}</Text>
        </TouchableOpacity>
      )}
    />
  );
};
const CustomYearDropdown: React.FC<{ data: any[]; value: string; onChange: (item: any) => void }> = ({ data, value, onChange }) => {
  return (
    <FlatList
      style={styles.dropdown}
      data={data}
      keyExtractor={(item) => item.value}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onChange(item)}>
          <Text style={styles.dropdownItem}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const TDSStatement: React.FC<TDSProps> = () => {
  const { t } = useTranslation();
  const [fiscalYearData, setFiscalYearData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [loader, showLoader] = useState(false);
  const [isFocusFiscalYear, setIsFocusFiscalYear] = useState(false);
  const [isFocusMonth, setIsFocusMonth] = useState(false);
  const [fiscalYearValue, setFiscalYearValue] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleDropdownFiscalYear = () => {
    setIsFocusFiscalYear(!isFocusFiscalYear);
    setIsFocusMonth(false);
  };

  const handleDropdownMonth = () => {
    setIsFocusMonth(!isFocusMonth);
    setIsFocusFiscalYear(false);
  };

  useEffect(() => {
    showLoader(true);

    getFiscalYear().then(async (response) => {
      const result = await response.json();
      setFiscalYearData(result);
      setFiscalYearValue(result[0]);
      showLoader(false);
    });

    getMonth().then(async (response) => {
      const result = await response.json();
      setMonthData(result);
      setSelectedMonth(result[0].month)
      showLoader(false);
    });
  }, []);

  return (
    <View style={styles.mainWrapper}>
      {loader && <Loader />}

      <Text style={styles.greyText}>{t('strings:select_fiscal_year')}</Text>
      <TouchableOpacity onPress={handleDropdownFiscalYear}>
        <View style={styles.card}>
          <Text style={styles.yearText}>{fiscalYearValue}</Text>
          <Image
            style={styles.downImage}
            source={require('../../../../../assets/images/ic_ticket_drop_down2.png')}
          />
        </View>
      </TouchableOpacity>

      {isFocusFiscalYear && (
        <CustomYearDropdown
          data={fiscalYearData}
          value={fiscalYearValue}
          onChange={(item) => {
            setFiscalYearValue(item);
            setIsFocusFiscalYear(false);
          }}
        />
      )}

      <Text style={styles.greyText}>{t('strings:select_month')}</Text>
      <TouchableOpacity onPress={handleDropdownMonth}>
        <View style={styles.card}>
          <Text style={styles.yearText}>{selectedMonth}</Text>
          <Image
            style={styles.downImage}
            source={require('../../../../../assets/images/ic_ticket_drop_down2.png')}
          />
        </View>
      </TouchableOpacity>

      {isFocusMonth && (
        <CustomMonthDropdown
          data={monthData}
          value={selectedMonth}
          onChange={(item) => {
            setSelectedMonth(item.month);
            setIsFocusMonth(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 20,
    marginHorizontal: 10,
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
  dropdown: {
    position: 'absolute',
    top: responsiveFontSize(5),
    left: 10,
    right: 10,
    backgroundColor: colors.white,
    elevation: 2,
  },
  dropdownItem: {
    padding: 10,
    fontSize: responsiveFontSize(2),
    color: colors.black,
  },
});

export default TDSStatement;
