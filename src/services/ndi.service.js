import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const proofNdiRequest = (isFacialProof) => {
    return (
        axios
            .post(BASE_URL + "ndi/proofRequest", [], {
                params: { isFacialProof }
            })
            .then((response) => {
                return response;
            })
        );
};
const nats_subscribe = (threadId) => {
    return axios
        .get(BASE_URL + "ndi/nats-subscribe", {
            params: { threadId },
        })
        .then((response) => {
            return response;
        });
};

// const proofNdiRequestSignUp = () => {
//     return (
//         axios
//             .post(BASE_URL + "api/user/profile/signup/proofRequest", [])
//             .then((response) => {
//                 // console.log(response);
//                 return response;
//             })
//     );
// };

export default {
    proofNdiRequest,
    nats_subscribe,
    // proofNdiRequestSignUp
};