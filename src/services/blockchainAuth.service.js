import { jwtDecode } from 'jwt-decode';
import blockchainService from 'services/blockchain.service';
import { clearBlockchainToken, setBlockchainToken } from '../utils/bc-token-stogare';

const getStoredToken = () => window.localStorage.getItem('bc_token');

const verifyBlockchainToken = (token) => {
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        return decoded.exp > Date.now() / 1000;
    } catch {
        return false;
    }
};

const fetchBlockchainAccessToken = async () => {
    const storedToken = getStoredToken();

    if (verifyBlockchainToken(storedToken)) {
        return storedToken;
    }

    try {
        const response = await blockchainService.getBlockchainToken();
        const newToken = response.data;

        if (newToken) {
            setBlockchainToken(newToken);
            return newToken;
        }
    } catch (err) {
        clearBlockchainToken();
        console.error('Failed to fetch blockchain access token:', err);
    }

    return null;
};

export default {
    fetchBlockchainAccessToken,
    verifyBlockchainToken,
};
