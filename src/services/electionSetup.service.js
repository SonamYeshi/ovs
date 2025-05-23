// import axios from "axios";
import axios from 'utils/axios';
import authHeader from './auth-header';

const BASE_URL = 'electionSetup';


// sub election type

const saveSubElectionType = (data) => {
    return axios.post(BASE_URL + '/saveElection', data, {
        headers: authHeader()
    });
};

const getAllSubElectionType = () => {
    return axios.get(BASE_URL + '/getAllElection');
};
const getAllElectionParameter = () => {
    return axios.get(BASE_URL + '/getAllElectionParameter');
};

const deleteSubElection = (id) => {
    return axios.delete(BASE_URL + '/deleteElection/' + id);
};

const getElectionByElectionType = (id) => {
    return axios.get(BASE_URL + '/getElectionByElectionType/' + id);
};

export default {
    saveSubElectionType,
    getAllSubElectionType,
    deleteSubElection,
    getAllElectionParameter,
    getElectionByElectionType
};
