// import axios from "axios";
import axios from 'utils/axios';
import authHeader from './auth-header';

const BASE_URL = 'common';

const getAllDzongkhags = () => {
    return axios.get(BASE_URL + '/getAllDzongkhags');
};


const getAllGewogsByDzoId = (dzongkhag_id) => {
    return axios.get(BASE_URL + '/getAllGewogsByDzoId/' + dzongkhag_id);
};
const getAllVillagesByGewogId = (gewog_id) => {
 
    return axios.get(BASE_URL + '/getAllVillagesByGewogId/' + gewog_id);
};

export default {
    getAllDzongkhags,
    getAllGewogsByDzoId,
    getAllVillagesByGewogId
};
