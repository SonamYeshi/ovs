import axios from "axios";
import authHeader from "./auth-header";

const BASE_URL = import.meta.env.VITE_BASE_URL + 'api/v1/blockchain';

const getBlockchainToken = async () => {
    const response = await axios
        .get(BASE_URL + "/bc-access-token", {});
    return response;
};

const getElectionResult = (electionTypeId, electionId, bc_token) => {
    return axios.get(`${BASE_URL}/getElectionResult/${electionTypeId}/${electionId}`, {
        params: {
            bcToken: bc_token
        }
    });
};

const saveVote = (data) => {
    return axios.post(
        BASE_URL+"/recordVote",
        data,
    );
};

export default {
    getBlockchainToken,
    getElectionResult,
    saveVote
};