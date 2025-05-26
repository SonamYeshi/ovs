export const clearDIDs = async () => {
    localStorage.removeItem('relationship_did');
    localStorage.removeItem('holder_did');
};

export const setDIDs = async (relationship_did, holder_did) => {
    if (relationship_did && holder_did) {
        localStorage.setItem('relationship_did', relationship_did);
        localStorage.setItem('holder_did', holder_did);
    }
};
