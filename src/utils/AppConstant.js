const AppConstant = () => {
    return {
        NDI: {
            VIDEO_GUIDE: 'https://www.youtube.com/watch?v=A_k79pml9k8',
            NDI_GOOGLE_STORE_URL: 'https://play.google.com/store/search?q=bhutan%20ndi&c=apps&hl=en_IN&gl=US',
            TEXT_COLOR: '#5AC994',
            BG_COLOR: '#124143',
            NDI_APPLE_STORE_URL: 'https://apps.apple.com/in/app/bhutan-ndi/id1645493166'
        },
        PROFILE_STATUS: {
            PENDING: 'P',
            WAITING_VERIFICATION: 'W',
            VERIFIED: 'V',
            REJECTED: 'R'
        },
        REQUIRED_FIELD: 'This field is required!',
        CHARACTER_LENGTH: 'This field must be less than 10 characters',
        INVALID_FIELD: 'Invalid value'
    };
};

export default AppConstant;
