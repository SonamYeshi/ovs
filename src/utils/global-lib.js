// import { defineAbility } from '@casl/ability';
import { createTheme } from '@mui/material';
// import 'assets/css/custom-file.css';
import moment from 'moment';
import Swal from 'sweetalert2';

export const ContentType = {
    JSON: 'application/json',
    MULTIPART: 'multipart/form-data'
};

/*Different roles in system*/
const Roles = {
    EMPLOYER: 1,
    JOB_SEEKER: 2,
    COMMITTEE_MEMBER: 3,
    SUPER_ADMIN: 4
};

const EmployerApproval = {
    ACTIVE: 'A',
    INACTIVE: 'I',
    PENDING: 'P'
};
// const PreliminaryShortlistingCriteriaType = {
//     WORK_EXPERIENCE: 'WE',
//     PROFESSIONAL_CERTIFICATION: 'PC',
//     ACADEMIC_PUBLICATION: 'AP',
//     OTHER_ACTIVITIES: 'OA'
// };

const VolunteerismType = {
    SOCIAL_ACTIVITIES: 'SA',
    EXTRACURRICULAR: 'EC',
    TRAINING: 'TA'
};

const DOCTYPE = {
    DOCX: 'docx',
    PDF: 'pdf',
    XLS: 'xls',
    HTML: 'html'
};

const QualificationType = {
    CLASS_X: 1,
    CLASS_XII: 2,
    DIPLOMA: 3,
    DEGREE: 4,
    VTI: 5,
    TVET: 6,
    MASTER: 7,
    PHD: 8,
    POSTGRADUATE: 9
};

const getUserDetail = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const getUserId = () => {
    if (getUserDetail() !== null) {
        return getUserDetail()?.userId;
    }
    return null;
};

const getRoles = () => {
    if (getUserDetail() !== null) {
        return getUserDetail()?.roles;
    }
    return [];
};

const getCurrentUserIdAndFullName = () => {
    if (getUserDetail() !== null) {
        return [getUserDetail()?.userId, getUserDetail()?.fullName];
    }
    return [];
};
const getScreenPermissions = () => {
    if (getUserDetail() !== null) {
        return getUserDetail()?.screenPermissions;
    }
    return [];
};

const getLocalDateString = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
};

// export const defineUserAbility = (screens, roles, userId) => {
//     return defineAbility((can) => {
//         screens?.forEach((screen) => {
//             if (roles?.includes('Admin')) {
//                 // Admins have full control over everything
//                 can('manage', 'all');
//             } else if (roles?.includes('Employer')) {
//                 // Employers can manage all user screens
//                 can('manage', 'Users');
//                 screen.permissions.forEach((permission) => {
//                     can(permission?.toLowerCase(), screen.name); // Make the action lowercase for consistency
//                 });
//             } else {
//                 screen.permissions.forEach((permission) => {
//                     can(permission?.toLowerCase(), screen.name); // Make the action lowercase for consistency
//                 });
//                 if (screen.name === 'Users') {
//                     can('manage', 'Users', { id: userId });
//                 }
//             }
//         });
//     });
// };

// const ability = defineUserAbility(getScreenPermissions(), getRoles(), getUserId());

const hasViewPermission = (accessPermission) => {
    let userInfo = getUserDetail();
    if (userInfo !== null && typeof userInfo.accessPermissions !== 'undefined') {
        return userInfo.accessPermissions.indexOf(accessPermission) !== -1;
    } else {
        return false;
    }
};

const screenRolePermission = [
    {
        id: '1',
        name: 'Skills',
        url: '/skills',
        permissions: ['1-CREATE', '2-READ', '4-UPDATE', '3-WRITE']
    },
    {
        id: '2',
        name: 'Attachment Types',
        url: '/attachment-types',
        permissions: ['1-CREATE', '2-READ', '4-DELETE']
    },
    {
        id: '3',
        name: 'Screens',
        url: '/screens',
        permissions: ['1-CREATE', '2-READ', '3-WRITE']
    },
    {
        id: '4',
        name: 'Permissions',
        url: '/permissions',
        permissions: ['1-CREATE', '2-READ', '3-WRITE']
    },
    {
        id: '5',
        name: 'Courses',
        url: '/course',
        permissions: ['1-CREATE', '2-READ', '3-WRITE']
    },
    {
        id: '5',
        name: 'Screen Role Permissions',
        url: '/screen-role-permissions',
        permissions: ['1-CREATE', '2-READ', '3-WRITE']
    },
    {
        id: '6',
        name: 'Workspaces',
        url: '/workspaces',
        permissions: ['1-CREATE', '2-READ', '3-WRITE']
    },
    {
        id: '7',
        name: 'Roles',
        url: '/roles',
        permissions: ['1-CREATE', '2-READ', '3-WRITE']
    }
];

// date formate for material ui v 5 for date picker
export const dateFormater = (date) => {
    if (date !== '') {
        return moment(new Date(date.getTime() + 6 * 60 * 60 * 1000));
    }
};

// function to conver unix timestamp to datetimestamp
export const dateConverter = (unix) => {
    return new Date(unix);
};

// date Validation

export const dateValidation = () => {
    const date = dateFormater();

    const d = parseInt(date['_d'].getDate());
    const m = parseInt(date['_d'].getMonth());
};

export const inputMask = (cid, visibleDigits = 4) => {
    //     const numberString = cid.toString();

    //     const length = numberString.length;

    //     const digitsToHide = Math.max(length - 8, 0)

    //     const digitsToShow = Math.floor((length - digitsToHide) / 2)

    //    const maskedNumber = numberString.substring(0, digitsToShow) + '*'.repeat(digitsToHide) + numberString.substring(length - digitsToShow);
    const maskedPart = '*'.repeat(cid.length - visibleDigits);
    const visiblePart = cid.slice(-visibleDigits);
    return maskedPart + visiblePart;
    // return maskedNumber;
};

// handling of future dates

export const currentDates = new Date();
// regx fro email and password
export const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
export const passRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])(?!.*\s).{8,}$/;
export const emailErrMsg = 'Invalid email';

export const passErrMsg =
    'Password must include at least one uppercase letter, one number, and one special character ,must not contain whitespace,';
export const cidRegex = /\b\d{11}\b/;
export const cidErrMsg = 'CID must be a total of 11 digits.';
export const mobileRegex = /^(17|16|77)\d{6}$/;
export const mobileErrMsg = 'Invaild Mobile number. It should contain 8 digits either starting from 17, 77, 16';

export const mobileOfficialRegex = /^\d{8}$/;
export const mobileOfficialErrMsg = 'Invaild Mobile number.';
export const TEXT_REGEX = /^[a-zA-Z\s]*$/;

function isValidEmail(email) {
    return emailRegex.test(email);
}

function isInteger(value) {
    return /^\d+$/.test(value); // ✅ Checks if value contains only digits (0-9)
}
//----------------------------------------------------------------

// handlign of past date
const editorConfiguration = {
    toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        'undo',
        'redo',
        'fontColor',
        'fontFamily',
        'fontSize'
    ],
    fontColor: {
        colors: [
            { color: '#000000', label: 'Black' },
            { color: '#FFFFFF', label: 'White' },
            { color: '#FF0000', label: 'Red' },
            { color: '#FFA500', label: 'Orange' },
            { color: '#FFFF00', label: 'Yellow' },
            { color: '#00FF00', label: 'Lime' },
            { color: '#0000FF', label: 'Blue' },
            { color: '#800080', label: 'Purple' }
        ]
    },
    fontFamily: {
        options: [
            'Arial, sans-serif',
            'Georgia, serif',
            'Impact, Charcoal, sans-serif',
            'Tahoma, Geneva, sans-serif',
            'Times New Roman, Times, serif',
            'Verdana, Geneva, sans-serif'
        ]
    },
    fontSize: {
        options: [8, 10, 12, 14, 16, 18, 20, 22, 24]
    },
    removePlugins: ['MediaEmbed', 'ImageInsert']
};

const sweetAlert = (title, type, message) => {
    return Swal.fire({
        title: title ?? '<h5 style="font-size:12px;">HTML <u>Message</u></h5>',
        icon: type ?? 'info',
        html: message ?? `You can use <b>Message</b>`,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: `<i class="fa fa-thumbs-up"></i> OK! 👌`,
        confirmButtonAriaLabel: 'Thumbs up, great!'
    });
};

const generateErrorListHTML = (errors) => {
    let htmlString = '<ul style="list-style-position: inside; padding-left: 0; text-align: left; font-size: 12px;">';

    for (const [key, value] of Object.entries(errors)) {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter

        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            // Handle nested object errors
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
                htmlString += `
                    <li style="margin-bottom: 5px;">
                        <strong>${nestedKey}</strong>: ${nestedValue} in <strong>${formattedKey}</strong>
                    </li>`;
            }
        } else if (Array.isArray(value)) {
            // Handle arrays of objects (like educationQualifications, academicPublications, otherActivities)
            htmlString += `
                <li style="margin-bottom: 5px;"><strong>${formattedKey}</strong>:</li>
                <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; font-size: 12px; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Row</th>
                        <th>Field</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>`;
            value?.forEach((item, row) => {
                if (item != null) {
                    for (const [field, message] of Object.entries(item)) {
                        const formattedField = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize field name
                        htmlString += `
                        <tr>
                            <td>${row + 1}</td>
                            <td>${formattedField}</td>
                            <td>${message}</td>
                        </tr>`;
                    }
                }
            });
            htmlString += `</tbody></table>`;
        } else {
            // Simple key-value pair errors
            htmlString += `<li style="margin-bottom: 5px;"><strong>${formattedKey}</strong>: ${value}</li>`;
        }
    }

    htmlString += '</ul>';
    return htmlString;
};

const successMsg = (msg) => {
    return Swal.fire({
        title: 'Success!',
        text: msg,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        customClass: {
            container: 'sweet-alert-modal'
        }
    });
};

const warningMsg = (msg) => {
    Swal.fire({
        title: 'Warning!',
        text: msg,
        icon: 'warning',
        // showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        customClass: {
            container: 'sweet-alert-modal'
        }
        // confirmButtonText: 'Yes, proceed!',
        // cancelButtonText: 'Cancel'
    });
    // .then((result) => {
    //     return result.isConfirmed
    // });
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

export const DECLEAR_RESUTL = 'Publish Shortlisting Candidates';

export const generateUniqueFileName = (prefix = 'file') => {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomString = Math.random().toString(36).substring(2, 10); // Random string of 8 characters
    return `${prefix}_${timestamp}_${randomString}`;
};

export default {
    getUserDetail,
    getUserId,

    hasViewPermission,

    successMsg,
    warningMsg,

    sweetAlert,
    generateErrorListHTML,
  
    getScreenPermissions,
    getRoles,
    generateUniqueFileName,
    getCurrentUserIdAndFullName,
    isValidEmail,
    isInteger,


    // used
    getLocalDateString
};
