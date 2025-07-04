import axios from 'utils/axios';
import authHeader from './auth-header';

const BASE_URL = 'api/v1/candidate';

const saveCandidate = (data) => {
    return axios.post(BASE_URL + '/saveCandidate', data, {
        headers: authHeader()
    });
};

const getCandidates = (electionTypeId, electionId, dzongkhag, gewog, village) => {
    return axios.get(`${BASE_URL}/getCandidates/${electionTypeId}/${electionId}/${dzongkhag}/${gewog}/${village}`, {
        headers: authHeader()
    });
};

const getAllCandidates = () => {
    return axios.get(BASE_URL + '/getAllCandidates');
};

const deleteCandidate = (id) => {
    return axios.delete(BASE_URL + '/deleteCandidate/' + id);
};

export default {
    saveCandidate,
    getCandidates,
    getAllCandidates,
    deleteCandidate
};
