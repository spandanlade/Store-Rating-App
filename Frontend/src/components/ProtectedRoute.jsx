import React from 'react'
import { Navigate } from 'react-router-dom';
import { getrole } from '../utils/auth';

export default function ProtectedRoute({children, allowedRoles}) {
    const role = getrole();

    if(!role){
        return <Navigate to="/"/>
    }
    if(!allowedRoles.includes(role)){
        return <Navigate to="/"/>
    }

  return children;
}
