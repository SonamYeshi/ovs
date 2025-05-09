export const clearAuthTokens = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('serviceToken');
    localStorage.removeItem('refreshToken');
    // localStorage.removeItem('authToken');
};

export const setAuthTokens = async (authToken, refreshToken, data) => {
    if (authToken && refreshToken && data) {
        localStorage.setItem('user', data);
        localStorage.setItem('serviceToken', authToken);
        localStorage.setItem('refreshToken', refreshToken);
        // localStorage.setItem('authToken', authToken);
    }
};
