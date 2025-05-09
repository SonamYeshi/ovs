import axios from 'utils/axios';
import { clearAuthTokens } from '../utils/auth-storage';

const BASE_URL = 'api/auth';

// Login function
const login = async (username, password) => {
    await clearAuthTokens();
    try {
        const response = await axios.post(
            BASE_URL+"/login",
            {username, password},
        );
        return { response, success: true };
    } catch (error) {
        return { error, success: false };
    }
};


const loginProofRequest = async () => {
  return await axios.get(BASE_URL + '/loginWithNdi');
};
export default { login, loginProofRequest };
