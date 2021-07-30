import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = 'http://192.168.100.62:8090/api';

const cafeApi = axios.create({ baseURL });

//middleware
cafeApi.interceptors.request.use(
    async(config) => {
        const token = await AsyncStorage.getItem('token');
        if ( token ){
            config.headers['x-token'] = token;
        }
        return config;
    }
)

export default cafeApi; 