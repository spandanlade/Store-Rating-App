import React from 'react';
import { useState, useEffect} from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function AdminDashboard() {

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    name:"",
    email:"",
    address:"",
    role:"",
    sort:"",
    order:""
  });

  const [form, setForm] = useState({
    name:"",
    email:"",
    password:"",
    address:"",
    role:"USER"
  });

  const [storeForm , setStoreForm] = useState({
    name:"",
    email:"",
    address:"",
    owner_id:""
  });

  const handleStoreChange = (e)=>{
    setStoreForm({
      ...storeForm, [e.target.name]: e.target.value
    });
  };

  const handleFormChange = (e) =>{
    setForm({
      ...form, [e.target.name]: e.target.value
    });
  };

  // Create user form Submit Function
  const createUser = async() =>{
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
      await api.post("/admin/users", form);

      alert("User created successfully");

      // To refresh user list-
      fetchUser();

      setForm({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER"
      });
    } catch(err){
      console.log(err);
      alert("Error creating user");
    }
  };

  //Create store form Submit Function
  const createStore = async ()=>{
    try{
      await api.post("/admin/stores", storeForm);

      alert("Store created successfully");

      fetchStores();

      setStoreForm({
        name:"",
        email:"",
        address:"",
        owner_id:""
      });
    }catch (err){
      console.log(err);
      alert("Error creating store");
    }
  };

  useEffect(()=>{
    fetchDashBoard();
    fetchUser();
    fetchStores();
  },[]);

  // console.log(users);
  // console.log(stores);

  const fetchDashBoard = async () =>{
    try{
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    }catch(err){
      console.log(err);
    }
  };

  const fetchUser = async (customFilters = filters) =>{
    try{
      const res = await api.get("/admin/users/filter",{
        params: customFilters
      });
      setUsers(res.data);
    }catch(err){
      console.log(err);
    }
  };

  const fetchStores = async ()=>{
    try {
      const res = await api.get("/admin/stores");
      setStores(res.data);
    } catch(err){
      console.log(err);
    }
  };



  return (
    <div>

      <Navbar/>
      <h1>Admin Dashboard</h1>
      {stats && (
        <div className='statistics'>
          <div className='card'><h3>Total Users: {stats.totalUsers}</h3></div>
          <div className='card'><h3>Total Stores: {stats.totalStores}</h3></div>
          <div className='card'><h3>Total Ratings: {stats.totalRatings}</h3></div>  
        </div>
      )}
      <hr/>

      <h1>Users</h1>
      <br></br>

      <h2>Create User</h2>

      <div className='auth-container'>
        <input name='name' placeholder='Name' value={form.name} onChange={handleFormChange}/>
        <br/><br/>
        <input name='email' placeholder='Email' value={form.email} onChange={handleFormChange}/>
        <br/><br/>
        <input name='password' type='password' placeholder='Password' value={form.password} onChange={handleFormChange}/>
        <br/><br/>
        <input name='address' placeholder='Address' value={form.address} onChange={handleFormChange}/>
        <br/><br/>
        <select name='role' value={form.role} onChange={handleFormChange}>
          <option value='USER'>USER</option>
          <option value='ADMIN'>ADMIN</option>
          <option value='OWNER'>OWNER</option>
        </select>
        <br/><br/>
      <button onClick={createUser}>Create User</button>
      </div>
      
      

      <h2>Filters</h2>
      <div className='filters'>
        <input placeholder='Name' onChange={(e)=>{
        const newFilters = {...filters, name: e.target.value};
        setFilters(newFilters);
        fetchUser(newFilters);
        }
      }
      />
      <input placeholder='Email' onChange={(e)=>{
        const newFilters = {...filters, email: e.target.value};
        setFilters(newFilters);
        fetchUser(newFilters);
      }} />

      <input placeholder='Address' onChange={(e)=>{
        const newFilters = {...filters, address: e.target.value};
        setFilters(newFilters);
        fetchUser(newFilters);
      }} />

      <select onChange={(e)=>{
        const newFilters = {...filters, role: e.target.value};
        setFilters(newFilters);
        fetchUser(newFilters);
      }}>
        <option value="">All Roles</option>
        <option value="ADMIN">ADMIN</option>
        <option value="USER">USER</option>
        <option value="OWNER">OWNER</option>
      </select>
      <button onClick={()=>{
        const newFilters = {...filters, sort: "name", order: "acs"};
        setFilters(newFilters);
        fetchUser(newFilters);
      }}>Name &uarr; </button>

      <button onClick={()=>{
        const newFilters={...filters, sort: "name", order: "desc"};
        setFilters(newFilters);
        fetchUser(newFilters);
      }}>Name &darr; </button>

      <button onClick={()=>{
        const newFilters={...filters, sort: "email", order:"asc"};
        setFilters(newFilters);
        fetchUser(newFilters);
      }}>Email &uarr; </button>

      <button onClick={()=>{
        const newFilters = {...filters, sort: "email", order:"desc"};
        setFilters(newFilters);
        fetchUser(newFilters);
      }}>Email &darr; </button>
      </div>
      

      <br/><br/>
  

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u)=>(
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
              <td><Link to={`/admin/users/${u.id}`}>View Details</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr/>
      
      <h2>Stores</h2>

      <h2>Create Store</h2>
      <div className='auth-container'>
        <input name='name' placeholder='Name' value={storeForm.name} onChange={handleStoreChange}/>
        <br/><br/>
        <input name='email' placeholder='Email' value={storeForm.email} onChange={handleStoreChange}/>
        <br/><br/>
        <input name='address' placeholder='Address' value={storeForm.address} onChange={handleStoreChange}/>
        <br/><br/>
        <input name='owner_id' placeholder='Owner ID' value={storeForm.owner_id} onChange={handleStoreChange}/>
        <br/><br/>
        <button onClick={createStore}>Create Store</button>
      </div>
      
      <br/><br/>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s)=>(
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.average_rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr/>
      <br/><br/>
    </div>
  );
}
