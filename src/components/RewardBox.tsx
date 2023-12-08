import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { ScratchCard } from 'rn-scratch-card';

interface ScratchCardProps {
  color?: string;
  fontWeight?: string;
  fontSize?: number;
  textContent: string;
}

interface RewardImageProps {
  resourceLocation?: number;
  resourceUrl?: string;
}

interface ButtonProps {
  buttonText?: string;
}

interface ScratchCardProps {
  visible: boolean;
  onClose: () => void;
  scratchCardProps: {
    textInput?: boolean;
    rewardImage: RewardImageProps;
    rewardResultText: ScratchCardProps;
    text1: ScratchCardProps;
    text2: ScratchCardProps;
    text3: ScratchCardProps;
    button: ButtonProps;
  };
  scratchable?: boolean;
}

const RewardBox: React.FC<ScratchCardProps> = ({
  visible,
  onClose,
  scratchCardProps,
  scratchable = false,
}) => {
  const [text, onChangeText] = useState('');

  const styles = StyleSheet.create({
    scratch_card: {
      height: '100%',
      width: '100%',
      backgroundColor: 'transparent',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'red',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      width: '70%',
      height: '50%',
      position: 'absolute',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    buttonClose: {
      flexDirection: 'column',
      justifyContent: 'right',
      height: 60,
      width: 60,
    },
    modalImage: {
      width: 100,
      height: 100,
      marginVertical: 10,
    },
    modalButton: {
      padding: 10,
      marginVertical: 10,
      backgroundColor: '#F0C300',
    },
    textInputWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    text: {
      color: scratchCardProps.rewardResultText.color || 'blue',
      fontWeight: scratchCardProps.rewardResultText.fontWeight || '500',
      fontSize: scratchCardProps.rewardResultText.fontSize || 16,
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    textInputAlign: {
      color: 'black',
      borderColor: 'black',
      borderWidth: 1,
      width: '80%',
      borderRadius: 10,
      placeholderTextColor: 'black',
      paddingLeft: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    rewardImage: { height: 100, width: 100, alignSelf: 'center' },
    text1: {
      color: scratchCardProps.text1.color || 'blue',
      fontWeight: scratchCardProps.text1.fontWeight || '500',
      fontSize: scratchCardProps.text1.fontSize || 16,
      marginTop: 5,
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    text2: {
      color: scratchCardProps.text2.color || 'blue',
      fontWeight: scratchCardProps.text2.fontWeight || '500',
      fontSize: scratchCardProps.text2.fontSize || 16,
      marginTop: 5,
      textAlign: 'center',
    },
    text3: {
      color: scratchCardProps.text3.color || 'blue',
      fontWeight: scratchCardProps.text3.fontWeight || '500',
      fontSize: scratchCardProps.text3.fontSize || 16,
      textAlign: 'center',
      marginTop: 5,
    },
    regWarButton: { textAlign: 'center', color: 'black' },
  });

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Image
                style={styles.buttonClose}
                source={require('../assets/images/ic_close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textInputWrapper}>
            {scratchCardProps.textInput && (
              <TextInput
                style={styles.textInputAlign}
                onChangeText={onChangeText}
                value={text}
                placeholder="Enter text here"
                placeholderTextColor="grey"
              />
            )}
          </View>

          {scratchCardProps.rewardImage.resourceLocation && (
            <Image
              style={styles.rewardImage}
              source={scratchCardProps.rewardImage.resourceLocation}
            />
          )}
          
          {scratchCardProps.rewardImage.resourceUrl && (
            <Image
              style={styles.rewardImage}
              source={{
                url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
              }}
            />
          )}

         

          <Text style={styles.text}>
            {scratchCardProps.rewardResultText.textContent}
          </Text>
          <Text style={styles.text1}>{scratchCardProps.text1.textContent}</Text>
          <Text style={styles.text2}>{scratchCardProps.text2.textContent}</Text>
          <Text style={styles.text3}>{scratchCardProps.text3.textContent}</Text>

          {scratchCardProps.button.buttonText && (
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => console.log('Register warranty ')}>
              <Text style={styles.regWarButton}>
                {scratchCardProps.button.buttonText}
              </Text>
            </TouchableOpacity>
          )}
          {scratchable && (
            <ScratchCard
              source={require('../assets/images/ic_scratch_card_greeting_2.webp')}
              brushWidth={20}
              style={styles.scratch_card}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default RewardBox;
