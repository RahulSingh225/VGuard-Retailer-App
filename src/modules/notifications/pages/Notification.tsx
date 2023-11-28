import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Notification: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, This is a Plain Page!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Notification;
