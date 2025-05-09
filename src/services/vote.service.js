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

export default{
    getCandidates
};