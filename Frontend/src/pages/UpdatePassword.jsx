import { useState } from "react";
import api from "../services/api";

export default function UpdatePassword() {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword]= useState("");

    const handleUpdate = async ()=>{
        try{
            const res = await api.put("/update-password",{
                oldPassword,
                newPassword
            });
            
            alert(res.data.message);

            localStorage.removeItem("token");
            window.location.href ="/";
        } catch(err){
            console.log(err);

            alert(err.response?.data?.message || "Failed to Update Password");
        }
    };
  return (
    <div className="auth-container">
      <h2>Update Password</h2>

      <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e)=>
        setOldPassword(e.target.value)}/>

      <br/><br/>
      
      <input type="password" placeholder="New Password" value={newPassword} onChange={
        (e)=>setNewPassword(e.target.value)}/>

      <br/><br/>

      <button onClick={handleUpdate}>Update Password</button>
    </div>
  );
}
