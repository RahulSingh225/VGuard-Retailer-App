import Geolocation from 'react-native-geolocation-service';

export default async function getLocation() {
  var data = {};
  Geolocation.getCurrentPosition(
    position => {
      data.lat = position.coords.latitude;
      data.long = position.coords.longitude;
      console.log("Position:", position);
      return position;
    },
    error => {
      // See error code charts below.
      console.log(error.code, error.message);
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );
}
module.exports = getLocation;
