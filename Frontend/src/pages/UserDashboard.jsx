import React, { useState } from 'react'
import { useEffect} from 'react';
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function UserDashboard() {

  const [stores, setStore] = useState([]);
  const [search, setSearch] = useState("");
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();

  useEffect(()=>{
    fetchStores();
  },[]);

  const fetchStores = async () =>{
    try{
      const res = await api.get("/stores");
      setStore(res.data);
    }catch (err){
      console.log(err);
    }
  };

  const submitRating = async (store) =>{

    const selectedRating = ratings[store.id];
    try{
      if(store.my_rating){
        console.log("putting");
        await api.put("/ratings", {
        store_id: store.id,
        rating:selectedRating
      });
      alert("Rating Updated"); 
      }
      else{
        console.log("posting");
        await api.post("/ratings", {
        store_id: store.id,
        rating:selectedRating
      });
      alert("Rating submitted");
      }
      
      fetchStores();
      
    }catch (err){
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar/>
      <h1>User Dashboard</h1>
      <div className='user-dash'>
        <input placeholder="Search by store name or address"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}/>

        {stores.filter(store =>
          store.name.toLowerCase().includes(search.toLowerCase()) ||
          store.address.toLowerCase().includes(search.toLowerCase())
        )
        .map(store=>(
          <div key={store.id} className='user-card'>
            <h3>{store.name}</h3>
            <p>Address: {store.address}</p>
            <p>
              Overall Rating:{store.average_rating || "No Ratings"}
            </p>
            <p>
              Your Rating:
              {store.my_rating || "Not Rated"}
            </p>
            <select value={ratings[store.id] || ""}
            onChange={(e)=>
              setRatings({
                ...ratings,[store.id]:e.target.value
              })
            }>
              <option value="">Select Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <button onClick={()=> submitRating(store)}>Submit or Update Rating</button>
            <hr/>
            </div>
            ))}
      </div>
      
      <br/>
      <br/>
    </div>
  );
}
