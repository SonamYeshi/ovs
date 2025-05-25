import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';    

import { clearAuthTokens, setAuthTokens } from '../utils/auth-storage';
import { clearBlockchainToken } from '../utils/bc-token-stogare';
import { clearDIDs } from '../utils/ndi-storage';

import { useDispatch as useReduxDispatch } from '../store';

import userService from 'services/userService';
import authServices from 'services/auth.service';

const chance = new Chance();

// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

// Check if token is valid
const verifyToken = (serviceToken) => {
    if (!serviceToken) return false;
    try {
        const decoded = jwtDecode(serviceToken);
        return decoded.exp > Date.now() / 1000;
    } catch {
        return false;
    }
};

// Store token & attach to axios
const setSession = async (serviceToken, refreshToken, user) => {
    if (serviceToken) {
        await setAuthTokens(serviceToken, refreshToken, user);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        await clearAuthTokens();
        await clearBlockchainToken();
        await clearDIDs();
        delete axios.defaults.headers.common.Authorization;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
    const reduxDispatch = useReduxDispatch();
    const [state, dispatch] = useReducer(accountReducer, initialState);

    // Refresh access token
    // const getRefreshToken = async () => {
    //     try {
    //         const refreshTokenStored = localStorage.getItem('refreshToken');
    //         const data = {
    //             refreshToken: refreshTokenStored
    //         };

    //         const response = await userService.getRefreshToken(data);
    //         // const response = await axios.post('http://localhost:8080/api/auth/refreshtoken', {refreshToken});
    //         const { accessToken, refreshToken, user } = response.data;
    //         setSession(accessToken, refreshToken, user);
    //         return accessToken;
    //     } catch (err) {
    //         console.error('Refresh token failed', err);
    //         logout();
    //         return null;
    //     }
    // };

    const init = async () => {
        try {
            const accessToken = window.localStorage.getItem('serviceToken'),
                user = window.localStorage.getItem('user'),
                refreshToken = window.localStorage.getItem('refreshToken');

            if (accessToken && verifyToken(accessToken)) {
                setSession(accessToken, refreshToken, user);

                dispatch({
                    type: LOGIN,
                    payload: {
                        isLoggedIn: true,
                        user
                    }
                });
            } else {
                logout();
            }
        } catch (err) {
            console.error(err);
            logout();
        }
    };

    useEffect(() => {
        init();
    }, []);

    const login = async (username, password, navigate) => {
        const response = await authServices.login(username, password);
        // console.log(response);
        if (response.success) {
            const { serviceToken, refreshToken, user } = response.response.data;

            await setSession(serviceToken, refreshToken, user);

            dispatch({
                type: LOGIN,
                payload: {
                    isLoggedIn: true,
                    user
                }
            });
            navigate('/dashboard');
        } else {
            return response.error;
        }
    };

    const logout = () => {
        setSession(null);
        dispatch({ type: LOGOUT });
    };

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return <JWTContext.Provider value={{ ...state, login, logout }}>{children}</JWTContext.Provider>;
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
