import React from 'react'
import { useState, useEffect } from 'react';
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function OwnerDashboard() {

  const [stores, setStores] = useState([]);

  const navigate = useNavigate();

  useEffect(()=>{
    fetchOwnerDashboard();
  },[]);

  const fetchOwnerDashboard = async ()=>{
    try{
      const res = await api.get("owner/dashboard");
      setStores(res.data);
    }catch (err){
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar/>
      <h1>Owner Dashboard</h1>
      
      
      {stores.map(store =>(
        <div key={store.store_id} className='store-card'>
          <h2>{store.store_name}</h2>
          <p>Address: {store.address}</p>
          <p>
            Average Rating: 
            {store.average_rating || "No Ratings"}
          </p>
          <h3>Users Who Rated</h3>
          <table border="1">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {store.users_ratings?.map(user=>(
                <tr key={user.user_id}>
                  <td>{user.user_name}</td>
                  <td>{user.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
      ))}
      <br/><br/>
    </div>
  )
}
