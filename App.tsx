import React, {useEffect} from 'react';
import {AuthProvider} from './src/components/AuthContext';
import AppNavigator from './src/components/AppNavigator';
import {Alert, PermissionsAndroid} from 'react-native';
import notificationListener from './src/modules/notifications/pages/PushNotification';

const App: React.FC = () => {
  useEffect(() => {
    // requestCameraPermission();
    requestAllPermissions();
    notificationListener();
  }, []);
  async function requestAllPermissions() {
    try {
      const cameraPermission = PermissionsAndroid.PERMISSIONS.CAMERA;
      const contactPermission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
      const notificationPermission =  PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      const locationPermission =
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;

      const granted = await PermissionsAndroid.requestMultiple([
        cameraPermission,
        contactPermission,
        locationPermission,
        notificationPermission
      ]);

      if (
        granted[cameraPermission] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[contactPermission] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[locationPermission] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Camera, contact and location permissions granted.');
        // You can now use the camera, access contacts, and access the device's location.
      } else {
        Alert.alert(
          'Permission denied',
          'You must grant camera, contact, and location permissions to use this feature.',
        );
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  }
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
