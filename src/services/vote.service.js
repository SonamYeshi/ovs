// import axios from "axios";
import axios from 'utils/axios';
import authHeader from './auth-header';

// const BASE_URL = "http://localhost:8080/";
// const BASE_URL = "api/auth";

// const saveVote = (data) => {
//     return axios.post(
//         "voter/recordVote",
//         data,
//         {
//             headers: authHeader()
//         }
//     );
// };
// const getElectionResult = (electionId, bc_token) => {
//     alert(bc_token)
//     return axios.get('blockchain/getElectionResult/'+electionId, {
//         // headers: authHeader()
//         headers: {
//             Authorization: `Bearer ${bc_token}`
//         }
//     });
// };

const getElectionType = () => {
    return axios.get('voter/getElectionType', {
        // headers: authHeader()
    });
};

const deleteElection = (id) => {
    return axios.delete('voter/deleteElection/' + id);
};

const getAllEligibilityCriteria = () => {
    return axios.get('voter/getAllEligibilityCriteria');
};

const deleteEligibilityCriteria = (id) => {
    return axios.delete('voter/deleteEligibilityCriteria/' + id);
};

// sub election type

const saveSubElectionType = (data) => {
    return axios.post('voter/saveSubElectionType', data, {
        headers: authHeader()
    });
};

const getAllSubElectionType = () => {
    return axios.get('voter/getAllSubElectionType');
};

const deleteSubElection = (id) => {
    return axios.delete('voter/deleteSubElection/' + id);
};

export default {
    // getCandidates,
    // saveVote,
    // getElectionResult,
    getElectionType,
    deleteElection,
    getAllEligibilityCriteria,
    deleteEligibilityCriteria,
    saveSubElectionType,
    getAllSubElectionType,
    deleteSubElection
};
