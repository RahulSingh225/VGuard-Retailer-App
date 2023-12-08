import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TextInput,
} from 'react-native';
import closeIcon from '../assets/images/ic_close.png';
import okIcon from '../assets/images/ic_accept_black2.png';

import colors from '../../colors';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import { useTranslation } from 'react-i18next';

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  onOk: (pin: string) => void;
}

const PopupWithPin: React.FC<PopupProps> = ({ isVisible, onClose, onOk }) => {
  if (!isVisible) {
    return null;
  }
  const { t } = useTranslation();
  const [pin, setPin] = useState(['', '', '', '']);
  const inputRefs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  const handleTextChange = (text: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);
    if (text && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePress = () => {
    const pinString = pin.join('');
    onOk(pinString);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.popupText}>{t('strings:please_enter_pin')}</Text>
          <View style={styles.pinContainer}>
            {pin.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={styles.pinInput}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleTextChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') {
                    handleBackspace(index);
                  }
                }}
              />
            ))}
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.closeButton} onPress={handlePress}>
              <Image
                source={okIcon as ImageSourcePropType}
                style={{ flex: 1, width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Image
                source={closeIcon as ImageSourcePropType}
                style={{ flex: 1, width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: 220,
    width: '80%',
    padding: 30,
    backgroundColor: colors.yellow,
    borderRadius: 10,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButton: {
    width: responsiveHeight(8),
    height: responsiveHeight(8),
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 25
  },
  closeButtonText: {
    color: 'blue',
  },
  popupText: {
    color: colors.black,
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: responsiveHeight(3),
    width: '90%',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 25
  },
  pinInput: {
    flex: 1,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 10,
    textAlign: 'center',
    color: colors.black,
    elevation: 5
  },
});

export default PopupWithPin;
