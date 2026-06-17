import { useState,useEffect } from "react";
import {useParams} from 'react-router-dom';
import api from "../services/api";

export default function UserDetails() {

    const {id} = useParams();
    const [user, setUser] = useState(null);

    useEffect(()=>{
        fetchUser();
    },[]);

    const fetchUser = async ()=>{
        try{
           const res = await api.get(`/admin/users/${id}`);
           
           setUser(res.data);
        }catch(err){
            console.log(err);
        }
    };

    if(!user) return <h2>Loading...</h2>

  return (
    <div className="user-details">
      <div className="user-view-card">
        <h2>User Details</h2>

      <span className="detail-label"></span>
      <p><span className="detail-label">Name: </span>{" "}{user.name}</p>
      <p><span className="detail-label">Email: </span>{" "}{user.email}</p>
      <p><span className="detail-label">Adress: </span>{" "}{user.address}</p>
      <p><span className="detail-label">Role: </span>{" "}{user.role}</p>

      {user.role==="OWNER" && (
        <p>
           <span className="detail-label">Average Rating: </span>{" "} {user.average_rating || "No Rating"}
        </p>
      )}
      </div>
      

    </div>
  );
}
