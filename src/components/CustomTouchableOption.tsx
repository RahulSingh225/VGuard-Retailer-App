import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import colors from '../../colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

interface CustomTouchableOptionProps {
  text: string;
  iconSource: any; // Adjust the type based on your icon source type
  screenName: string;
  disabled?: boolean;
}

const CustomTouchableOption: React.FC<CustomTouchableOptionProps> = ({ text, iconSource, screenName, disabled = false }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[
        styles.oval,
        disabled && styles.disabledOval // Apply disabled style if disabled is true
      ]}
      onPress={() => navigation.navigate(screenName)}
      disabled={disabled}
    >
      <View style={[
        styles.optionIcon,
        disabled && styles.disabledOptionIcon // Apply disabled style if disabled is true
      ]}>
        <Image
          source={iconSource}
          style={[
            { flex: 1, width: undefined, height: undefined },
            disabled && styles.disabledImage
          ]}
          resizeMode="contain"
        />
      </View>
      <Text style={[
        styles.nav,
        disabled && styles.disabledText
      ]}>
        {t(text)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  disabledOval: {
    opacity: 0.9,
  },
  disabledImage: {
    filter: 'grayscale(100%)',
  },
  disabledText: {
    color: colors.grey,
  },
});

export default CustomTouchableOption;
