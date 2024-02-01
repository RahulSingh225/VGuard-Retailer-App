import axios, {AxiosInstance} from 'axios';
import {useAuth} from '../components/AuthContext';

const BASE_URL = 'http://192.168.1.37:5000/vguard/api';
// const BASE_URL = 'http://34.93.182.174:5000/vguard/api';

const useAxios = () => {
  const {setIsUserAuthenticated} = useAuth();
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
  });
  return axiosInstance;
};

export default useAxios;
