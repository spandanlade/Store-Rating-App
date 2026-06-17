import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Reginster() {

    const navigate = useNavigate();

    const [form,setForm] = useState({
        name:"",
        email:"",
        address:"",
        password:""
    });

    const handleChange = (e)=>{
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleRegister = async () =>{
      const { name, email, address, password } = form;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

    if (name.length < 20 || name.length > 60) {
        alert("Name must be between 20 and 60 characters");
        return;
    }

    if (address.length > 400) {
        alert("Address cannot exceed 400 characters");
        return;
    }

    if (!emailRegex.test(email)) {
        alert("Please enter a valid email");
        return;
    }

    if (!passwordRegex.test(password)) {
        alert(
            "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
        );
        return;
    }
        try{
            await api.post("/register", form);
            alert("Registration successful");
             navigate("/");
        } catch(err){
            console.log(err);

            alert(err.response?.data?.message || "Registration failed");
        }
    };
  return (
    <div className="auth-container">
      <h1>Register</h1>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange}/>
      <br/><br/>
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange}/>
      <br/><br/>
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange}/>
      <br/><br/>
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange}/>
      <br/><br/>
      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}
