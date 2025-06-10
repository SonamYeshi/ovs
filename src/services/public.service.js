import axios from 'utils/axios';
import authHeader from './auth-header';

const BASE_URL = 'api/v1/public';

const getAllActiveElections = () => {
    return axios.get(BASE_URL + '/getAllActiveElections');
};

const getCandidates = (electionTypeId, electionId, dzongkhag, gewog, village) => {
    return axios.get(`${BASE_URL}/getCandidates`, {
        params: {
            electionTypeId,
            electionId,
            dzongkhag,
            gewog,
            village
        }
    });
    // return axios.get(`${BASE_URL}/getCandidates/${electionTypeId}/${electionId}/${dzongkhag}/${gewog}/${village}`);
};

// const getAllElections = () => {
//     return axios.get(BASE_URL + '/getAllElection');
// };

export default {
    getAllActiveElections,
    getCandidates,
    // getAllElections,
};
