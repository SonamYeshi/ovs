import { jwtDecode } from "jwt-decode";

export default function authHeader() {
//   const user = JSON.parse(localStorage.getItem("user"));
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