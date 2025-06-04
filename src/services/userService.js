// import axios from "axios";
import axios from "utils/axios";
import authHeader from "./auth-header";

// const BASE_URL = "http://localhost:8080/";
const BASE_URL = "api/v1/auth";

const registerUser = (data) => {
    return axios.post(
        BASE_URL + "/register",
        data
    );
};

const getAllUsers = () => {
    return axios.get(
        BASE_URL + "/getUsers",
            {
                headers: authHeader()
            }
    );
};

// const saveElectionEligibility = (data) => {
//     return axios.post(
//         BASE_URL + "voter/saveEligibility",
//         data,
//         {
//             headers: authHeader()
//         }
//     )
// };

// const saveElectionType = (data) => {
//     // console.log(authHeader());
//     return axios.post(
//         "voter/saveElection",
//         data,
//         {
//             headers: authHeader()
//         }
//     )
// };

const getRefreshToken = (data)=> {
    console.log(data);
    return axios.post('api/auth/refreshtoken',
        data,
    );
};

// const deleteEligibilityCriteria = (id) => {
//     return axios.delete( 'voter/deleteEligibilityCriteria/' + id);
// };

// const getAllEligibilityCriteria = () => {
//     return axios.get('voter/getAllEligibilityCriteria');
// };

export default {
    registerUser,
    getAllUsers,
    // saveElectionEligibility,
    getRefreshToken,
    // saveElectionType,
    // deleteEligibilityCriteria,
    // getAllEligibilityCriteria
};