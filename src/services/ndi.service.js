import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const proofNdiRequest = (isFacialProof, relationshipDID) => {
    return (
        axios
            .post(BASE_URL + "api/v1/ndi/proofRequest", [], {
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
            .post(BASE_URL + "api/v1/vc/proofRequestForVC", [], {
            })
            .then((response) => {
                return response;
            })
        );
};

export default {
    proofNdiRequest,
    proofNdiREquestForECBVC,
};