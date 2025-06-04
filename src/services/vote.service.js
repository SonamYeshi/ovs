// import axios from "axios";
import axios from 'utils/axios';
import authHeader from './auth-header';

const BASE_URL = "api/v1/voter";

// const getElectionType = () => {
//     return axios.get(BASE_URL+'/getElectionType', {
//         // headers: authHeader()
//     });
// };

const saveElectionEligibility = (data) => {
    return axios.post(
        BASE_URL + "/saveEligibility",
        data,
        {
            headers: authHeader()
        }
    )
};

const getAllEligibilityCriteria = () => {
    return axios.get(BASE_URL+'/getAllEligibilityCriteria');
};

const deleteEligibilityCriteria = (id) => {
    return axios.delete(BASE_URL+'/deleteEligibilityCriteria/' + id);
};

// const deleteElection = (id) => {
//     return axios.delete(BASE_URL+'/deleteElection/' + id);
// };

// sub election type

const saveSubElectionType = (data) => {
    return axios.post(BASE_URL+'/saveSubElectionType', data, {
        headers: authHeader()
    });
};

const getAllSubElectionType = () => {
    return axios.get(BASE_URL+'/getAllSubElectionType');
};

const deleteSubElection = (id) => {
    return axios.delete(BASE_URL+'/deleteSubElection/' + id);
};

export default {
    // getCandidates,
    // saveVote,
    // getElectionResult,
    // getElectionType,
    saveElectionEligibility,
    // deleteElection,
    getAllEligibilityCriteria,
    deleteEligibilityCriteria,
    saveSubElectionType,
    getAllSubElectionType,
    deleteSubElection
};
