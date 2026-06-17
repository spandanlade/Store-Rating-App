import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async ()=>{
        try{
            const res = await api.post("/login",{
                email,
                password
            });

            // console.log(res.data);

            localStorage.setItem("token",res.data.token);

            const decoded = jwtDecode(res.data.token);

            if(decoded.role === "ADMIN"){
                navigate("/admin");
            }else if(decoded.role === "USER"){
                navigate("/user");
            }else{
                navigate("/owner");
            }
            alert("Login successfull")
        }
        catch(err){
            console.log(err);
            alert("Login failed");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
            <br/><br/>
            <input placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
            <br/><br/>
            <button onClick={handleLogin}>Login</button><span style={{marginLeft:5, marginRight:5}}>Don't have and account?</span><Link to="/register">Register</Link> 
        </div>
    );   
}

export default Login;