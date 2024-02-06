import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useAuth } from '../components/AuthContext';
import useAxios from './useAxios';

const BASE_URL = 'http://192.168.29.15:5000/vguard/api';
// const BASE_URL = 'http://34.93.182.174:5000/vguard/api';
// const BASE_URL = 'http://34.93.239.251:5000/vguard/api';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export async function newTokens(token: string) {
  try {
    const path = 'user/refreshAccessToken'
    const response: AxiosResponse = await createPostRequest(path, { refreshToken: token });
    const { accessToken, refreshToken } = response.data;
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return { accessToken, newRefreshToken: refreshToken };
  } catch (error) {
    throw new Error('Failed to refresh tokens');
  }
}

// api.interceptors.response.use(
//   response => response,
//   async error => {
//     if (error.response.status === 401) {
//       const refreshToken = JSON.parse(
//         (await AsyncStorage.getItem('refreshToken')) as string,
//       );
//       try {
//         const { newRefreshToken } = await newTokens(refreshToken);
//         await AsyncStorage.setItem(
//           'refreshToken',
//           JSON.stringify(newRefreshToken),
//         );
//         // return api(originalRequest);
//       } catch (refreshError: any) {
//         console.log(`${refreshError.message}`);
//         //logout

//       }
//     }
//     return Promise.reject(error);
//   },
// );

async function createPostRequest(
  relativeUrl: string,
  data: any,
): Promise<AxiosResponse> {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const response: AxiosResponse = await api.post(relativeUrl, data, {
    headers,
  });
  return response;
}

async function createGetRequest(relativeUrl: string): Promise<AxiosResponse> {
  try {
    const response = await api.get(relativeUrl);
    return response;
  } catch (error) {
    console.error('Error:', relativeUrl, error);
    throw error;
  }
}

const update_fcm_token = async () => {
  const path = 'pushNotification/registerToken';
  try {
    let fcmtoken = await messaging().getToken();
    if (fcmtoken) {
      let body = {
        fcmToken: fcmtoken,
      };
      await createPostRequest(path, body);
    } else {
      console.log('Error : Issue in firebase FCM generater, ', fcmtoken);
    }
  } catch (e) {
    console.log('Error : ', e);
  }
};

export async function loginWithPassword(
  userName: string,
  password: string,
  role: string,
): Promise<AxiosResponse> {
  const path = 'user/loginWithSp';
  const response = await createPostRequest(path, { userName, password, role });
  if (response.status === 200) {
    if (response.data.name !== "Fail") {
      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${response.data.tokens.accessToken}`;
    } else {
      throw new Error("Invalid username or password");
    }
  }
  return response;
}

export async function loginWithOtp(username: string, otp: string, roleId: string) {
  const path = 'user/userDetails/login';
  const response = await createPostRequest(path, { username, otp, roleId });
  if (response.status === 200) {
    api.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${response.data.tokens.accessToken}`;
  }
  return response;
}

interface NewUserOtpValidationResponse {
  data: {
    message: string;
    // Add other properties based on your API response
  };
  // Add other properties based on your API response
}

export const Newuserotpvalidation = async (
  mobileNo: string,
  otp: string,
): Promise<NewUserOtpValidationResponse> => {
  try {
    const requestBody = {
      mobileNo: mobileNo,
      otp: otp,
    };
    const response = await api.post('user/validateNewUserOtp', {
      mobileNo: mobileNo,
      otp: otp,
    });

    return response.data as NewUserOtpValidationResponse;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export function getUsers(filter: string) {
  const path = 'user/';
  return createPostRequest(path, filter);
}

export function getFile(uuid: String, imageRelated: String, userRole: String) {
  const path = `file/${uuid}/${imageRelated}/${userRole}`;
  return createGetRequest(path);
}

export const sendFile = async (formData: FormData): Promise<any> => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  try {
    const response = await api.post('file', formData, config);
    return response;
  } catch (error: any) {
    console.error('Error', error);
    throw error;
  }
};

export function getDistributorList() {
  const path = 'user/dist/';
  return createGetRequest(path);
}

export function getTransactions(filter: string) {
  const path = 'transaction/';
  return createPostRequest(path, filter);
}

export function getRedemptionList(filter: string) {
  const path = 'redemption/history';
  return createPostRequest(path, filter);
}

export function getProductCategoryList() {
  const path = 'product/categories';
  return createGetRequest(path);
}

export function getProductListing(productRequest: string) {
  const path = 'product/catalog';
  return createPostRequest(path, productRequest);
}

export function getStates() {
  const path = 'state/';
  return createGetRequest(path);
}

export function getDistricts(stateId: string) {
  const path = `district/${stateId}`;
  return createGetRequest(path);
}

export function getCities(districtId: string) {
  const path = `city/${districtId}`;
  return createGetRequest(path);
}

export function checkMobileNumber(user: string) {
  const path = 'user/checkMobileNo';
  return createPostRequest(path, user);
}

export function generateOtp(user: string) {
  const path = 'user/generateOtp';
  return createPostRequest(path, user);
}

export function sendUser(user: string) {
  const path = 'user/signUp';
  return createPostRequest(path, user);
}

export function verifyOTP(user: string) {
  const path = 'user/verifyOtp';
  return createPostRequest(path, user);
}

export function redeem(redemption: string) {
  const path = 'redemption';
  return createPostRequest(path, redemption);
}

export function reLogin() {
  const path = 'user/relogin';
  return createGetRequest(path);
}

export function captureSale(couponDataList: any) {
  const path = 'coupon/process';
  return createPostRequest(path, couponDataList);
}

export function sendCouponPin(couponDataList: any) {
  const path = 'coupon/processForPin';
  return createPostRequest(path, couponDataList);
}

export function getUserByMobile(mobileNo: string) {
  const path = `user/${mobileNo}`;
  return createGetRequest(path);
}

export function uploadOrder(order: string) {
  const path = 'order';
  return createPostRequest(path, order);
}

export function getOrders() {
  const path = 'order/';
  return createGetRequest(path);
}

export function searchCoupon(coupon: string) {
  const path = `coupon/${coupon}`;
  return createGetRequest(path);
}

export function getCategoryList() {
  const path = 'product/categories';
  return createGetRequest(path);
}

export function getDownloads() {
  const path = 'product/getDownloadsData';
  return createGetRequest(path);
}

export function getAppVersion() {
  const path = 'user/retversion';
  return createGetRequest(path);
}

export function getPackCategoryList() {
  const path = 'pack/category';
  return createGetRequest(path);
}

export function getPackProductListing(categoryId: number) {
  const path = `pack/category/${categoryId}`;
  return createGetRequest(path);
}

export function getCouponList() {
  const path = 'couponList/';
  return createGetRequest(path);
}

export function updateanys(data: any) {
  const path = 'user/updateanys';
  return createPostRequest(path, data);
}

export function getByIfsc(ifscCode: string) {
  const path = `bank/${ifscCode}`;
  return createGetRequest(path);
}

export function updateOrder(token: number) {
  const path = 'order/update';
  return createPostRequest(path, token);
}

export function getTerritoryManager(filter: string) {
  const path = 'user/tm/';
  return createPostRequest(path, filter);
}

export function getDistrictMaster(stateId: number) {
  const path = `user/tm/district/${stateId}`;
  return createGetRequest(path);
}

export function uploadInvoice(invoice: string) {
  const path = 'invoice';
  return createPostRequest(path, invoice);
}

export function getInvoiceList() {
  const path = 'invoice/';
  return createGetRequest(path);
}

export function loadContestDetails(apmId: number, mobileNo: string) {
  const path = `displayContest/load/${apmId}/${mobileNo}`;
  return createGetRequest(path);
}

export function createDisplayContest(displayContest: string) {
  const path = 'displayContest/createContest';
  return createPostRequest(path, displayContest);
}

export function getSelectedSegmentProducts(
  segment: string,
  categoryId: number,
) {
  const path = `pack/selectedProducts/${segment}/${categoryId}`;
  return createGetRequest(path);
}

export function getVehicleSegment() {
  const path = 'pack/vehicleSegment';
  return createGetRequest(path);
}

export function sendAccessoryCoupon(couponDataList: any) {
  const path = 'coupon/accessory';
  return createPostRequest(path, couponDataList);
}

export function getDetails() {
  const path = 'user/upseDetails';
  return createGetRequest(path);
}

export function submitDetails(target: number) {
  const path = `user/upseDetails/${target}`;
  return createGetRequest(path);
}

export function fetchPendingApproval(screen: string) {
  const path = `redemption/pendingApproval/${screen}`;
  return createGetRequest(path);
}

export function updatePendingApproval(redemptionOrder: any) {
  const path = 'redemption/pendingApproval/update';
  return createPostRequest(path, redemptionOrder);
}

export function updateLogoutStatus() {
  const path = 'user/logoutStatus';
  return createGetRequest(path);
}

export function getUser() {
  const path = 'user/userDetails';
  return createGetRequest(path);
}

export function userLoginDetails() {
  const path = 'user/userDetails/login';
  return createGetRequest(path);
}

export function registerNewUser(vguardRishtaUser: any) {
  const path = 'user/registerUser';
  return createPostRequest(path, vguardRishtaUser);
}

export function updateKyc(kycDetails: any) {
  const path = 'user/updateKyc';
  return createPostRequest(path, kycDetails);
}

export function updateKycRetailer(kycDetails: any) {
  const path = 'user/updateKycRetailer';
  return createPostRequest(path, kycDetails);
}

export function addToCart(productDetail: any) {
  const path = 'product/addToCart';
  return createPostRequest(path, productDetail);
}

export function removeFromCart(productDetail: any) {
  const path = 'product/removeFromCart';
  return createPostRequest(path, productDetail);
}

export function bankTransfer(productOrder: any) {
  const path = 'order/bankTransfer';
  return createPostRequest(path, productOrder);
}

export function productOrder(productOrder: any) {
  const path = 'order/product';
  return createPostRequest(path, productOrder);
}

export function paytmTransfer(productOrder: any) {
  const path = 'order/paytmTransfer';
  return createPostRequest(path, productOrder);
}

export function paytmTransferForAirCooler(productOrder: any) {
  const path = 'order/paytmTransferAircooler';
  return createPostRequest(path, productOrder);
}

export function getCartItems() {
  const path = 'product/getCartProducts';
  return createGetRequest(path);
}

export function getPaytmPrdouctId() {
  const path = 'product/getPaytmProductId';
  return createGetRequest(path);
}

export function getBankProductId() {
  const path = 'product/getBankProductId';
  return createGetRequest(path);
}

export function getShippingAddress() {
  const path = 'user/shippingAddress';
  return createGetRequest(path);
}

export function getTicketTypes() {
  const path = 'ticket/types';
  return createGetRequest(path);
}

export function sendTicket(data: any) {
  const path = 'ticket/create';
  return createPostRequest(path, data);
}

export function getWhatsNew() {
  const path = 'whatsNew/';
  return createGetRequest(path);
}

export function getSchemeImages() {
  const path = 'schemes/';
  return createGetRequest(path);
}

export function getInfoDeskBanners() {
  const path = 'infoDesk/banners';
  return createGetRequest(path);
}

export function getTicketHistory() {
  const path = 'ticket/history';
  return createGetRequest(path);
}

export function getNotifications() {
  const path = 'alert/';
  return createGetRequest(path);
}

export function getKycIdTypes() {
  const path = 'user/kycIdTypes';
  return createGetRequest(path);
}

export function getKycIdTypesByLang(selectedLangId: number) {
  const path = `user/kycIdTypes/${selectedLangId}`;
  return createGetRequest(path);
}

export function validateNewMobileNo(vru: any) {
  const path = 'user/validateNewMobileNo';
  return createPostRequest(path, vru);
}

export function validateOtp(vguardRishtaUser: any) {
  const path = 'user/validateNewUserOtp';
  return createPostRequest(path, vguardRishtaUser);
}

export function getRishtaUserProfile() {
  const path = 'user/profile';
  return createGetRequest(path);
}

export function getBonusRewards() {
  const path = 'user/bonusPoints';
  return createGetRequest(path);
}

export function getProductWiseOffers() {
  const path = 'product/productWiseOffers';
  return createGetRequest(path);
}

export function getRedemptionHistory(type: string) {
  const path = `product/redemptionHistory?type=${type}`;
  return createGetRequest(path);
}

export function forgotPassword(number: string) {
  const path = 'user/forgotPassword';
  const body = {
    mobileNo: number,
  };
  return createPostRequest(path, body);
}

export function getScanCodeHistory() {
  const path = 'coupon/history';
  return createGetRequest(path);
}

export function generateOtpForLogin(body: any) {
  const path = 'user/generateOtpForLogin';
  return createPostRequest(path, body);
}

export function generateOtpForReverify(vru: any) {
  const path = 'user/generateOtpForReverify';
  return createPostRequest(path, vru);
}

export function validateReverifyOtp(vguardRishtaUser: any) {
  const path = 'user/validateReverifyOtp';
  return createPostRequest(path, vguardRishtaUser);
}

export function validateLoginOtp(body: any) {
  const path = 'user/validateLoginOtp';
  return createPostRequest(path, body);
}

export function updateProfile(vru: any) {
  const path = 'user/updateProfile';
  return createPostRequest(path, vru);
}

export function updateBank(bankDetail: any) {
  const path = 'user/updateBank';
  return createPostRequest(path, bankDetail);
}

export function getProductWiseOffersDetail(offerId: string) {
  const path = `product/productWiseOffers/${offerId}`;
  return createGetRequest(path);
}

export function getProdWiseEarning() {
  const path = 'product/getProductWiseEarning';
  return createGetRequest(path);
}

export function getReferralName(referralCode: string) {
  const path = `user/getReferralName/${referralCode}`;
  return createGetRequest(path);
}

export function getMonthWiseEarning(month: string, year: string) {
  const path = `user/monthWiseEarning/${month}/${year}`;
  return createGetRequest(path);
}

export function getBonusPoints(transactionId: string) {
  const path = `coupon/getBonusPoint/${transactionId}`;
  return createGetRequest(path);
}

export function getany() {
  const path = 'user/bankDetails';
  return createGetRequest(path);
}

export function getBanks() {
  const path = 'banks/';
  return createGetRequest(path);
  // return testingcreateGetRequest(path);
}

export function getKycDetails() {
  const path = 'user/kycDetails';
  return createGetRequest(path);
}

export function reUpdateUserForKyc(vru: any) {
  const path = 'user/reUpdateUserForKyc';
  return createPostRequest(path, vru);
}

export function getSchemeWiseEarning() {
  const path = 'schemes/getSchemeWiseEarning';
  return createGetRequest(path);
}

export function getProfession(isService: number) {
  const path = `user/getProfession/${isService}`;
  return createGetRequest(path);
}

export function getSubProfessions(professionId: string) {
  const path = `user/getSubProfession/${professionId}`;
  return createGetRequest(path);
}

export function logoutUser() {
  const path = 'user/logoutUser';
  return createPostRequest(path, {});
}

export function logOut(userId: number) {
  const path = 'user/logout';
  return createPostRequest(path, { userId });
}

export function getDetailsByPinCode(pinCode: string) {
  const path = `state/detailByPincode/${pinCode}`;
  return createGetRequest(path);
}

export function getCitiesByPincodeId(pinCodeId: number) {
  const path = `state/citiesByPincodeId/${pinCodeId}`;
  return createGetRequest(path);
}

export function getPincodeList(pinCode: string) {
  const path = `state/pinCodeList/${pinCode}`;
  return createGetRequest(path);
}

export function getVguardInfoDownloads() {
  const path = 'product/getVguardInfoDownloads';
  return createGetRequest(path);
}

export function getVguardProdCatalog() {
  const path = 'product/getVguardProdCatalog';
  return createGetRequest(path);
}

export function getActiveSchemeOffers() {
  const path = 'schemes/getActiveSchemeOffers';
  return createGetRequest(path);
}

export function setSelectedLangId(vguardRishtaUser: any) {
  const path = 'user/updateLanguageId';
  return createPostRequest(path, vguardRishtaUser);
}

export function getNotificationCount() {
  const path = 'alert/count';
  return createGetRequest(path);
}

export function updateReadCheck(notifications: any) {
  const path = 'alert/updateReadCheck';
  return createPostRequest(path, notifications);
}

export function processErrorCoupon(ec: any) {
  const path = 'coupon/processErrorCoupon';
  return createPostRequest(path, ec);
}

export function getRetProductCategories() {
  const path = 'product/retailerCategories';
  return createGetRequest(path);
}

export function getTierDetail() {
  const path = 'user/getTierDetail';
  return createGetRequest(path);
}

export function getRetailerCategoryDealIn() {
  const path = 'product/retCategoryDealIn';
  return createGetRequest(path);
}

export function getWelfarePdfList() {
  const path = 'welfare/';
  return createGetRequest(path);
}

export function registerToken(vru: any) {
  const path = 'pushNotification/registerToken';
  return createPostRequest(path, vru);
}

export function getPushNotifications() {
  const path = 'pushNotification/list';
  return createGetRequest(path);
}

export function getCustDetByMobile(mobileNo: string) {
  const path = `product/getCustomerDetails/${mobileNo}`;
  return createGetRequest(path);
}

export function validateMobile(mobileNumber: string, dealerCategory: string) {
  const path = `user/checkRetailerMobile/${mobileNumber}/${dealerCategory}`;
  return createGetRequest(path);
}

export function validateRetailerCoupon(couponData: any) {
  const path = 'coupon/validateRetailerCoupon';
  console.log(path)
  console.log(couponData)
  return createPostRequest(path, couponData);
}

export function sendCustomerData(cdr: any) {
  const path = 'product/registerCustomer';
  return createPostRequest(path, cdr);
}

export function getStatesFromCrmApi() {
  const path = 'state/crmState';
  return createGetRequest(path);
}

export function getDistrictsFromCrmApi(stateId: string) {
  const path = `district/crmDistricts/${stateId}`;
  return createGetRequest(path);
}

export function getDailyWinner(date: string) {
  const path = 'user/dailyWinners';
  const data = {
    date: date,
  };
  return createPostRequest(path, data);
}

export function getDailyWinnerDates() {
  const path = 'user/getDailyWinnerDates/';
  return createGetRequest(path);
}

export function getAirCoolerPointsSummary() {
  const path = 'user/getAirCoolerPointsSummary';
  return createGetRequest(path);
}

export function getAirCoolerSchemeDetails() {
  const path = 'user/getAirCoolerSchemeDetails';
  return createGetRequest(path);
}

export function senAirCoolerData(cdr: any) {
  const path = 'product/registerAirCoolerCustomer';
  return createPostRequest(path, cdr);
}

export function getAirCoolerScanCodeHistory() {
  const path = 'coupon/airCoolerScanHistory';
  return createGetRequest(path);
}

export function getCRMStateDistrictByPincode(pinCode: string) {
  const path = `state/getCRMStateDistrictByPinCode/${pinCode}`;
  return createGetRequest(path);
}

export function getCRMPinCodeList(pinCode: string) {
  const path = `state/getCRMPinCodeList/${pinCode}`;
  return createGetRequest(path);
}

export function checkScanPopUp(id: string) {
  const path = `user/scanPopUp/${id}`;
  return createGetRequest(path);
}

export function getAy() {
  const path = 'user/getAccessmentYear';
  return createGetRequest(path);
}

export function getTdsList(accementYear: string) {
  const path = `user/tdsCertificate/${accementYear}`;
  return createGetRequest(path);
}

export function getFiscalYear() {
  const path = 'user/getFiscalYear';
  return createGetRequest(path);
}

export function getMonth() {
  const path = 'user/getMonth';
  return createGetRequest(path);
}

export function getTdsStatementList(month: any) {
  const path = 'user/getTdsStatementList';
  return createPostRequest(path, month);
}

export function LoginWithSP(login: any) {
  const path = 'user/loginWithSp';
  return createPostRequest(path, login);
}

export function addLogin(user: any) {
  const path = 'user/addLogin';
  return createPostRequest(path, user);
}

export function getSubLoginList() {
  const path = 'user/getSubLoginList';
  return createGetRequest(path);
}

export function checkVPA() {
  const path = 'order/checkVPA';
  return createGetRequest(path);
}

export function verifyVPA() {
  const path = 'order/verifyVPA';
  return createGetRequest(path);
}

export function sendScanInCoupon(couponData: any) {
  const path = 'coupon/scanIn';
  return createPostRequest(path, couponData);
}
