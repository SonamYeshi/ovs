export const clearBlockchainToken = async () => {
    localStorage.removeItem('bc_token');
};

export const setBlockchainToken = async (bc_token) => {
    if (bc_token) {
        localStorage.setItem('bc_token', bc_token);
    }
};
