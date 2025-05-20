
export default function authHeader() {
  const token = localStorage.getItem('serviceToken');
if (token) {
  return {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };
} else {
  return {};
}
}

// const multipartAuthHeader = () => {
//     const token = localStorage.getItem('serviceToken');
//     if (token) {
//         return {
//             Authorization: 'Bearer ' + token,
//             'Content-Type': 'multipart/form-data'
//         };
//     } else {
//         return {};
//     }
// };
// const authHeader = () => {
//     const token = localStorage.getItem('serviceToken');
//     if (token) {
//         return {
//             Authorization: 'Bearer ' + token,
//             'Content-Type': 'application/json'
//         };
//     } else {
//         return {};
//     }
// };

// export default { multipartAuthHeader, authHeader };
