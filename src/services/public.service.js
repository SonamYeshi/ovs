import axios from 'utils/axios';
import authHeader from './auth-header';

const BASE_URL = 'api/v1/public';

const getAllElections = () => {
    return axios.get(BASE_URL + '/getAllElection');
};

const getCandidates = (electionTypeId, electionId, dzongkhag, gewog, village) => {
    return axios.get(`${BASE_URL}/getCandidates/${electionTypeId}/${electionId}/${dzongkhag}/${gewog}/${village}`);
};

export default {
    getAllElections,
    getCandidates
};
