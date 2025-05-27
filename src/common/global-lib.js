import { createTheme } from '@mui/material';
import Swal from 'sweetalert2';

const Roles = {
    OCASC_ADMINISTRATOR: 1,
    OCASC: 2,
    RCSC: 3,
    DMDF: 4,
    AGENCY_ADMIN: 5,
    USER: 6
};

// // regx fro email and password
export const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
export const passRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])(?!.*\s).{8,}$/;
export const emailErrMsg = 'Invalid email';
export const passErrMsg =
    'Password must include at least one uppercase letter, one number, and one special character ,must not contain whitespace,';
export const cidRegex = /\b\d{11}\b/;
export const cidErrMsg = 'CID must be a total of 11 digits.';

export const mobileRegex = /^(17|16|77)\d{6}$/;
export const mobileErrMsg = 'Invaild Mobile number. It should contain 8 digits either starting from 17, 77, 16';

// export const mobileOfficialRegex = /^\d{8}$/;
// export const mobileOfficialErrMsg = 'Invaild Mobile number.';
// export const TEXT_REGEX = /^[a-zA-Z\s]*$/;
export const DESCRIPTION_50_WORDS = /^(\b\w+\b\W*){0,50}$/;
export const DESCRIPTION_50_WORDS_ERRMSG = 'Words not more than 50.';
export const DESCRIPTION_500_WORDS = /^(\b\w+\b\W*){1,500}$/;
export const DESCRIPTION_500_WORDS_ERRMSG = 'Words not more than 500.';
export const DESCRIPTION_100_WORDS = /^(\b\w+\b\W*){1,100}$/;
export const DESCRIPTION_100_WORDS_ERRMSG = 'Words not more than 100.';

const successMsg = (msg) => {
    return Swal.fire({
        title: 'Success!',
        text: msg,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        allowOutsideClick: false, 
        allowEscapeKey: false,
        customClass: {
            container: 'sweet-alert-modal'
        },
        willOpen: () => {
            const swalModal = document.querySelector('.swal2-container');
            if (swalModal) {
                swalModal.style.zIndex = '9999';
            }
        }
    });
};

const warningMsg = (msg) => {
    return Swal.fire({
        title: 'Error!',
        text: msg,
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
        allowOutsideClick: false, 
        allowEscapeKey: false,
        customClass: {
            container: 'sweet-alert-modal'
        },
        willOpen: () => {
            const swalModal = document.querySelector('.swal2-container');
            if (swalModal) {
                swalModal.style.zIndex = '9999';
            }
        }
    });
};
const deleteMsg = (msg) => {
    Swal.fire({
        title: 'Are you sure?',
        text: msg,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        customClass: {
            container: 'sweet-alert-modal'
        },
        willOpen: () => {
            const swalModal = document.querySelector('.swal2-container');
            if (swalModal) {
                swalModal.style.zIndex = '9999';
            }
        }
    }).then((result) => {
        return result.isConfirmed;
    });
};

export const validateInput = (message) => {
    Swal.fire({
        title: 'Warning',
        text: message,
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok!'
        // cancelButtonText: 'Cancel'
    });
};

export const theme = createTheme({
    typography: {
        h1: {
            color: '#BB8644'
        },
        h2: {
            color: '#00ff00'
        },
        h3: {
            color: '#0000ff'
        },
        h4: {
            color: '#0000ff'
        },
        h5: {
            color: '#BB8644'
        },
        h6: {
            color: '#909E84'
        },
        h7: {
            color: '#000000'
        },
        body1: {
            color: '#333'
        }
    }
});

const getUserDetail = () => {
    try {
        const userData = localStorage.getItem('user'); // or sessionStorage.getItem()
        if (!userData) return null;

        // If it's already an object (some libraries like Redux persist may store it that way)
        if (typeof userData === 'object') return userData;

        // If it's a string, parse it
        return JSON.parse(userData);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

export default {
    Roles,
    successMsg,
    deleteMsg,
    warningMsg,
    getUserDetail
};
