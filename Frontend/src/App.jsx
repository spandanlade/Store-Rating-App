import React from 'react'
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import { Route, Routes} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import UserDetails from './pages/UserDetails';
import UpdatePassword from './pages/UpdatePassword';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/register' element={<Register />}></Route>

      <Route path='/admin' element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminDashboard />
        </ProtectedRoute>}></Route>
      <Route path='/user' element={
        <ProtectedRoute allowedRoles={["USER"]}>
          <UserDashboard />
        </ProtectedRoute>}></Route>
      <Route path='/owner' element={
        <ProtectedRoute allowedRoles={["OWNER"]}>
          <OwnerDashboard />
        </ProtectedRoute>}></Route>
      <Route path='/admin/users/:id' element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <UserDetails/>
        </ProtectedRoute>}></Route>
      <Route path="/update-password" element={
        <ProtectedRoute allowedRoles={['ADMIN','USER','OWNER']}>
            <UpdatePassword/>
        </ProtectedRoute>
      }></Route>
      <Route path="register" element={<Register/>}></Route>
    </Routes>
  );
}