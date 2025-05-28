import axios from "axios";
import authHeader from "./auth-header";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const generateVC = (data) => {
    return axios.post(
        BASE_URL+"vc/generateVC",
        data,
        {
            headers: authHeader()
        }
    );
};

export default {
    generateVC
};