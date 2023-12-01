import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import colors from '../../../../../../colors';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { getProdWiseEarning } from '../../../../../utils/apiservice';

interface ProductDetails {
  slNo: number;
  partDesc: string;
  points: number;
}

const ProductWiseEarning: React.FC = () => {
  const [productDetails, setProductDetails] = useState<ProductDetails[]>([]);

  useEffect(() => {
    getProdWiseEarning()
      .then(response => response.json())
      .then(responseData => {
        setProductDetails(responseData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const data = productDetails.map(product => [
    product?.slNo.toString(),
    product?.partDesc,
    product?.points.toString()
  ]);

  const tableHead = ["Sl No.", "Product Description", "Points"];

  return (
    <ScrollView style={styles.container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
        {data.length === 0 ? (
          <Rows data={[['No Data']]} textStyle={[styles.text, { color: colors.grey, fontWeight: 'bold', textAlign: 'center' }]} />
        ) : (
          <>
            <Row data={tableHead} style={styles.head} textStyle={styles.text} />
            <Rows data={data} textStyle={styles.text} />
          </>
        )}
      </Table>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  head: {
    height: responsiveHeight(7),
    backgroundColor: colors.lightGrey
  },
  text: {
    margin: 10,
    color: colors.black
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    textAlign: 'center',
    marginBottom: 10,
    color: colors.black,
    fontWeight: 'bold'
  }
});

export default ProductWiseEarning;
