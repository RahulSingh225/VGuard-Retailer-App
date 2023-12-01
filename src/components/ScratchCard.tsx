import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

interface ScratchCardProps {
  points: string;
  onPress: () => void;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ points, onPress }) => {
  return (
    <Pressable onPress={onPress} style={buttonStyles.button}>
      <Image
        style={{ height: 100, width: 100, alignSelf: 'center' }}
        source={require('../assets/images/ic_rewards_gift.png')}
      />
      <Text style={buttonStyles.text}>YOU WON</Text>
      <Text style={buttonStyles.text2}>{points}</Text>
      <Text style={buttonStyles.text3}>Points</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  app: {
    marginHorizontal: 'auto',
    width: '100%',
    height: '100%',
  },
  logo: {
    height: 80,
  },
  header: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginVertical: '1em',
    textAlign: 'center',
  },
  text: {
    lineHeight: '1.5em',
    fontSize: '1.125rem',
    marginVertical: '1em',
    textAlign: 'center',
  },
  link: {
    color: '#1B95E0',
  },
  code: {
    fontFamily: 'monospace, monospace',
  },
});

const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    marginTop: '25%',
    borderRadius: 2,
    borderWidth: 5,
    height: '40%',
    width: '70%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text: {
    color: 'black',
    fontWeight: '500',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  text2: {
    color: 'black',
    fontWeight: '500',
    marginTop: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  text3: {
    color: 'black',
    fontWeight: '100',
    fontSize: 8,
    textAlign: 'center',
  },
});

export default ScratchCard;
