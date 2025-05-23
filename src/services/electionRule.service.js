// import axios from "axios";
import axios from 'utils/axios';
import authHeader from './auth-header';

const BASE_URL = 'electionRule';

// sub election type

const saveElectionRule = (data) => {

    return axios.post(BASE_URL + '/saveElectionRule', data, {
        headers: authHeader()
    });
};

const getAllElectionRule = () => {
    return axios.get(BASE_URL + '/getAllElectionRule');
};

const deleteElectionRule = (id) => {
    return axios.delete(BASE_URL + '/deleteElectionRule/' + id);
};


const getElectionRuleByElection = (electionTypeId, electionId) => {
    return axios.get(`${BASE_URL}/getElectionRuleByElection/${electionTypeId}/${electionId}`);
};


export default {
    saveElectionRule,
    getAllElectionRule,
    deleteElectionRule,
    getElectionRuleByElection
};
