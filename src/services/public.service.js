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

const checkVoterEligibility = async (userDTO, electionId, electionTypeId) => {

    const payload = {
        dateOfBirth: userDTO.dob,
        dzongkhag: userDTO.dzongkhag,
        gewog: userDTO.gewog,
        village: userDTO.village,
        electionTypeId,
        electionId
    };

    const response = await axios.post(`${BASE_URL}/voterEligibilityCheck`, payload);
    return response.data;
};

export default {
    getAllActiveElections,
    getCandidates,
    checkVoterEligibility,
};
