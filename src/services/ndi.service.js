import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const proofNdiRequest = (isFacialProof, relationshipDID) => {
    return (
        axios
            .post(BASE_URL + "ndi/proofRequest", [], {
                params: { isFacialProof, relationshipDID }
            })
            .then((response) => {
                return response;
            })
        );
};
const proofNdiREquestForECBVC = () => {
    return (
        axios
            .post(BASE_URL + "vc/proofRequestForVC", [], {
            })
            .then((response) => {
                return response;
            })
        );
};
// const nats_subscribe = (threadId) => {
//     return axios
//         .get(BASE_URL + "ndi/nats-subscribe", {
//             params: { threadId },
//         })
//         .then((response) => {
//             return response;
//         });
// };

export default {
    proofNdiRequest,
    proofNdiREquestForECBVC,
    // nats_subscribe,
};