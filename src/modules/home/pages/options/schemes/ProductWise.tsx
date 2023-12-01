import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../../../../colors';
import { getProductWiseOffers } from '../../../../../utils/apiservice';

const baseURL = 'https://www.vguardrishta.com/';

interface Category {
  categoryId: number;
  imageUrl: string;
  // Add other properties as needed
}

interface ProductWiseProps {
  navigation: any; // You might want to replace 'any' with the correct type
}

const ProductWise: React.FC<ProductWiseProps> = ({ navigation }) => {
  const [data, setData] = useState<Category[]>([]);

  useEffect(() => {
    getProductWiseOffers()
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData);
        const updatedData = responseData.map((category: Category) => ({
          ...category,
          imageUrl: baseURL + category.imageUrl,
        }));
        setData(updatedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleCategoryPress = (categoryId: number) => {
    const category = data.find(item => item.categoryId === categoryId);
    console.log('category id:', categoryId);
    navigation.navigate('Product Wise Offers Table', { categoryId });
  };

  return (
    <ScrollView style={styles.mainWrapper}>
      {data.map(category => (
        <TouchableOpacity
          key={category.categoryId}
          style={styles.categoryContainer}
          onPress={() => handleCategoryPress(category.categoryId)}>
          <Image
            source={{ uri: category.imageUrl }}
            style={styles.categoryImage}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: colors.white,
    flex: 1,
  },
  categoryContainer: {
    alignItems: 'center',
    marginBottom: 1,
  },
  categoryImage: {
    width: '100%',
    height: 100,
  },
});

export default ProductWise;
