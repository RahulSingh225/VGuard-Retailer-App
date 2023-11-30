import Geolocation from 'react-native-geolocation-service';

async function getLocation() {
  var data = {};
  Geolocation.getCurrentPosition(
    position => {
      console.log(position);
      return position;
      data.lat = position.coords.latitude;
      data.long = position.coords.longitude;
    },
    error => {
      // See error code charts below.
      console.log(error.code, error.message);
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );
}
module.exports = getLocation;
