const imageBaseUrl =  "https://storage.googleapis.com/vguard_staging_bucket/";
// const imageBaseUrl = "http://34.100.133.239/";

export function getImageUrl(uuid, folderName) {
  let baseUrl = imageBaseUrl;

  switch (folderName) {
    case 'Profile':
      baseUrl += 'retimg/appImages/Profile/';
      break;
    case 'Cheque':
      baseUrl += 'retimg/appImages/Cheque/';
      break;
    case 'IdCard':
      baseUrl += 'retimg/appImages/IdCard/';
      break;
    case 'PanCard':
      baseUrl += 'retimg/appImages/PanCard/';
      break;
    case 'GST':
      baseUrl += 'retimg/appImages/GST/';
      break;
    default:
      break;
  }

  return `${baseUrl}${uuid}`;
}
