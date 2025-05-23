// import axios from "axios";
import axios from "utils/axios";
import authHeader from "./auth-header";

// const BASE_URL = "http://localhost:8080/";
const BASE_URL = "api/auth";

const registerUser = (data) => {
    return axios.post(
        "api/auth/register",
        data
    );
};

const getAllUsers = () => {
    // const token = localStorage.getItem('serviceToken');
    // alert(BASE_URL)
    return axios.get(
        "api/user/getUsers",
            {
                headers: authHeader()
            }
    );
};

const saveElectionEligibility = (data) => {
    // console.log(authHeader());
    return axios.post(
        "voter/saveEligibility",
        data,
        {
            headers: authHeader()
        }
    )
};

const saveElectionType = (data) => {
    // console.log(authHeader());
    return axios.post(
        "voter/saveElection",
        data,
        {
            headers: authHeader()
        }
    )
};

const getRefreshToken = (data)=> {
    console.log(data);
    return axios.post('api/auth/refreshtoken',
        data,
    );
};

const deleteEligibilityCriteria = (id) => {
    return axios.delete( 'voter/deleteEligibilityCriteria/' + id);
};

const getAllEligibilityCriteria = () => {
    return axios.get('voter/getAllEligibilityCriteria');
};

export default {
    registerUser,
    getAllUsers,
    saveElectionEligibility,
    getRefreshToken,
    saveElectionType,
    deleteEligibilityCriteria,
    getAllEligibilityCriteria
};