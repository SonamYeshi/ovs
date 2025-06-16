import axios from 'utils/axios';
import authHeader from './auth-header';

const BASE_URL = 'api/v1/electionSetup';

const saveElectionType = (data) => {
    return axios.post(
        BASE_URL + "/saveElectionType",
        data
    )
};

const getElectionType = () => {
    return axios.get(BASE_URL+'/getAllElectionType', {
    });
};

const deleteElectionType = (id) => {
    return axios.delete(BASE_URL+'/deleteElectionType/' + id);
};

// sub election type
const saveSubElectionType = (data) => {
    return axios.post(BASE_URL + '/saveElection', 
        data
    );
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

const getElectionsForResult = () => {
    return axios.get(BASE_URL + '/getElectionsForResult');
};

export default {
    saveElectionType,
    getElectionType,
    deleteElectionType,
    saveSubElectionType,
    getAllSubElectionType,
    deleteSubElection,
    getAllElectionParameter,
    getElectionByElectionType,
    getElectionsForResult,
};
