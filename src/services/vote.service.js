// import axios from "axios";
import axios from "utils/axios";
import authHeader from "./auth-header";

// const BASE_URL = "http://localhost:8080/";
// const BASE_URL = "api/auth";

const getCandidates = (electionTypeId) => {
    return axios.get(
        "candidate/getCandidates/"+electionTypeId,
            {
                headers: authHeader()
            }
    );
};

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

export default {
    getCandidates,
    // saveVote,
    // getElectionResult,
    getElectionType,
};