import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ReusableCarousel from '../../../../../components/ReusableCarousel';
import colors from '../../../../../../colors';
import CustomTouchableOption from '../../../../../components/CustomTouchableOption';
import NeedHelp from '../../../../../components/NeedHelp';

const Schemes: React.FC = () => {
  const carouselData = [
    { imageUrl: require('../../../../../assets/images/banner_redeem_ppoints.webp') },
    { imageUrl: require('../../../../../assets/images/banner.webp') },
    { imageUrl: require('../../../../../assets/images/banner_redeem_ppoints.webp') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.carousel}>
        <ReusableCarousel data={carouselData} />
      </View>
      <View style={styles.mainWrapper}>
        <View style={styles.options}>
          <CustomTouchableOption
            text="strings:product_wise_offers"
            iconSource={require('../../../../../assets/images/ic_product_wise_offers.webp')}
            screenName="Product Wise Offers"
          />
          <CustomTouchableOption
            text="strings:active_scheme_offers"
            iconSource={require('../../../../../assets/images/ic_active_offers.webp')}
            screenName="Active Schemes"
          />
          <CustomTouchableOption
            text="strings:special_combo_offers"
            iconSource={require('../../../../../assets/images/ic_special_combo_offers.webp')}
            screenName="Special Combo"
            disabled={true}
          />
        </View>
        <NeedHelp />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  carousel: {
    backgroundColor: colors.black,
  },
  options: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  mainWrapper: {
    padding: 15,
  },
});

export default Schemes;
