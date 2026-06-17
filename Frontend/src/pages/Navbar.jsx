import { useNavigate } from "react-router-dom";

export default function Navbar() {

    const navigate = useNavigate();

    const logout = ()=>{
        localStorage.removeItem("token");
        navigate("/");
    };

  return (
    <div className="navbar">
      <button onClick={()=>{
        navigate("/update-password")
      }}>Update Password</button>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
