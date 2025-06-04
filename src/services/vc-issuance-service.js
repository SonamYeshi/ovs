import axios from "utils/axios";
import authHeader from "./auth-header";

const BASE_URL = 'api/v1/vc';

const generateVC = (data) => {
    return axios.post(
        BASE_URL+"/generateVC",
        data,
        {
            headers: authHeader()
        }
    );
};

export default {
    generateVC
};