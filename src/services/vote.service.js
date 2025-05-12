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

const saveVote = (data) => {
    return axios.post(
        "voter/recordVote",
        data,
        {
            headers: authHeader()
        }
    );
};
const getVoteResult = () => {
    return axios.get('voter/getVoteResult', {
        headers: authHeader()
    });
};

export default {
    getCandidates,
    saveVote,
    getVoteResult
};