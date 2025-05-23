export const clearRelationshipDID = async () => {
    localStorage.removeItem('relationship_did');
};

export const setRelationshipDID = async (relationship_did) => {
    if (relationship_did) {
        localStorage.setItem('relationship_did', relationship_did);
    }
};
