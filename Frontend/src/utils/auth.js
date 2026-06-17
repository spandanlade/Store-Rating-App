import {jwtDecode} from 'jwt-decode';

export const getrole = ()=>{
    const token = localStorage.getItem("token");

    if(!token) return null;

    const decoded = jwtDecode(token);

    return decoded.role;
};

export const getUser= ()=>{
    const token = localStorage.getItem("token");

    if(!token) return null;

    return jwtDecode(token);
};