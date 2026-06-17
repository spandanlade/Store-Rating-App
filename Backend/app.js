const express = require('express');
const cors = require('cors');

const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_secret = "mysecretkey";
const verifyToken = require('./middleware/auth')
const isAdmin = require('./middleware/roles')

app.use(cors({
    origin: "http://localhost:5173"
}));


app.use(express.json());

const db = require("./db/connection"); 

const authRoutes = require("./routes/authRoutes");

app.use("/", authRoutes);

const adminRoutes = require("./routes/adminRoutes");

app.use("/", adminRoutes);

const storeRoutes = require("./routes/storeRoutes");

app.use("/", storeRoutes);

const ownerRoutes = require("./routes/ownerRoutes");

app.use("/", ownerRoutes);

// // API to create USER, ADMIN or OWNER, accessible to admin only
// app.post("/admin/users", verifyToken, isAdmin, async (req, res)=>{
//     console.log("route hit");
//     console.log(req.body);
    
//     const {name,email,password, address, role } = req.body;
    
//     try{

//         // Validating user
//         const allowedRoles =['USER', 'ADMIN', 'OWNER'];

//         if(!allowedRoles.includes(role)){
//             return res.status(400).json({message: "Invalid role"});
//         }

//         // Hashing password
//         const hashedpassword = await bcrypt.hash(password, 10);

//         const sql = `insert into users (name, email, password, address, role) values(?,?,?,?,?)`;

//         db.query(sql, [name, email, hashedpassword, address, role], (err, result)=>{
//             if(err){
//                 return res.status(500).json({message: "Database error", err});
//             }
//             res.json({message: "User created successfully",
//                 userId: result.inserId
//             });
//         });
//     }
//     catch (err) {
//         res.status(500).json({message: "Server error", err});
//     }
// });


// // Register, for user
// app.post("/register", async (req, res) => {
//     const {name, email, password, address} = req.body;

//     // check valid email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if(!emailRegex.test(email)){
//         return res.status(400).json({
//             message: "Invalid email format"
//         });
//     }

//     // checking if user already exist or not
//     const  checkUser = "select * from users where email = ?";

//     db.query(checkUser,[email], async (err, result) => {
//         if(err) {
//             return res.status(500).json({message: "Database error", err});
//         }

//         if(result.length > 0) {
//             return res.status(400).json({
//                 message: "Email already exist"
//             });
//         }

//         // hashing passoword using bcrypt
//         const hashedpassword = await bcrypt.hash(password, 10);

//         const sql = `insert into users (name, email, password, address, role) values (?,?,?,?,'USER')`;

//         db.query(sql, [name, email, hashedpassword, address], (err, result) => {
//             if(err){
//                 return res.status(500).json(err);
//             }
//             res.json({
//                 message: "User registered successfully",
//                 userId: result.insertId
//             });
//         });
//     });

// });



// app.post("/login", (req, res) => {
//     const {email, password} = req.body;

//     // Finding users details by using email
//     const sql = "select * from users where email=?";

//     db.query(sql, [email], async(err, result) =>{
//         if(err){
//             return res.status(500).json({message: "Database error", err});
//         }

//         // checking if user exist or not
//         if(result.length===0){
//             return res.status(400).json({message:"Invalid email or password"});
//         }

//         const user = result[0];

//         // Comparing password with hash
//         const isMatch = await bcrypt.compare(password,user.password);

//         if(!isMatch){
//             return res.status(400).json({message:"Invalid email or password"});
//         }

//         // Generating jwt token
//         const token = jwt.sign({
//             id: user.id,
//             email: user.email,
//             role:user.role
//         },jwt_secret, {expiresIn:"1h"});

//         res.json({
//             message:"Login Successful",
//             token
//         });
//     });
// });

// app.get("/profile", verifyToken, (req,res) => {
//     res.json({message:"Protected route", user:req.user});
// });


// // To add stores 
// app.post("/stores", verifyToken, isAdmin, (req, res) =>{
//     const {name, email, address, owner_id} =req.body;


//     const sql =`Insert into stores (name, email, address, owner_id) values(?,?,?,?)`;

//     db.query(sql,[name,email,address,owner_id],(err, result) =>{
//         if(err){
//             return res.status(500).json({
//                 message:"Database error",
//                 err
//             });
//         }
//         res.json({
//             message:"Store created successfully",
//             storeId: result.insertId
//         });
//     });
// });

// // To get all stores
// app.get("/stores",verifyToken,(req, res) =>{
//     const  user_id = req.user.id;
//     const sql = `select s.id, s.name, s.address, AVG(r.rating) as average_rating, max(case when r.user_id = ? then r.rating end) as my_rating from stores s LEFT JOIN ratings r ON s.id = r.store_id GROUP BY s.id, s.name, s.address`;
    
//     db.query(sql, [user_id],(err, result)=>{
//         if(err){
//             return res.status(500).json({
//                 message:"Database error",
//                 err
//             });
//         }
//         res.json(result);
//     });
// });

// // Rating Stores 
// app.post("/ratings", verifyToken, (req, res)=>{
//     const user_id=req.user.id;
//     const {store_id, rating}= req.body;

//     // checking valid rating range
//     if(rating <1 || rating >5){
//         return res.status(400).json({message:"Rating must be between 1 and 5"});
//     }

//     // checking if user already rated or not
//     const check = `select * from ratings where user_id = ? and store_id=?`;
    
//     db.query(check, [user_id,store_id], (err, result)=>{
//         if(err){
//             return res.status(500).json({message:"Database error",err});
//         }

//         if(result.length >0){
//             return res.status(400).json({message: "You already rated this store. Use update feature"});
//         }

//         // Rating Store
//         const insertSql = `insert into ratings (user_id,store_id,rating) values(?,?,?)`;

//         db.query(insertSql, [user_id, store_id, rating], (err, result)=>{
//             if(err){
//                 res.status(500).json({message: "Database error", err});
//             }
//             res.json({message:"Rating submitted",
//                 ratingId:result.insertId
//             });
//         });
//     });
// });

// // Update rating 
// app.put("/ratings",verifyToken, (req, res)=>{
//     const user_id = req.user.id;
//     const {store_id, rating}=req.body;

//     // checking valid rating range
//     if(rating <1 || rating >5){
//         return res.status(400).json({message:"Rating must be between 1 and 5"});
//     }

//     const updatesql = `update ratings set rating = ? where user_id=? and store_id=?`;

//     db.query(updatesql, [rating,user_id, store_id], (err, result)=>{
//         if(err){
//             return res.status(500).json({message: "Database error", err});
//         }
//         if(result.affectedRows === 0 ){
//             return res.status(404).json({message:"Rating not found"});
//         }

//         res.json({message: "Rating updated successfully"});
//     });

// });

// // To get Dashboard for owner
// app.get("/owner/dashboard", verifyToken, (req, res)=>{
//     const owner_id = req.user.id;
    
//     const sql =`select s.id as store_id, s.name as store_name, s.address, avg(r.rating) AS average_rating, 
//     JSON_ARRAYAGG( JSON_OBJECT( 'user_id', u.id, 'user_name', u.name, 'rating', r.rating)) AS users_ratings from stores s 
//     left join ratings r on s.id = r.store_id
//     left join users u on u.id = r.user_id
//     where s.owner_id = ? group by s.id, s.name, s.address`;

//     db.query(sql, [owner_id], (err, result)=>{
//         if(err){
//             res.status(500).json({message: "Database error",err});
//         }
//         res.json(result);
//     });
// });


// // Admin Dashboard
// app.get("/admin/dashboard", verifyToken, isAdmin, (req, res)=>{
//     const users = "select count(*) as totalUsers from users";
//     const stores ="select count(*) as totalStores from stores";
//     const ratings ="select count(*) as totalRatings from ratings";

//     db.query(users, (err, userResult)=>{
//         if(err){
//             return res.status(500).json({message: "Database error", err});
//         }
        
//         db.query(stores, (err, storeResult)=>{
//             if(err){
//                 return res.status(500).json({message: "Database error", err});
//             } 

//             db.query(ratings, (err, ratingResult)=>{
//                 if(err){
//                     return res.status(500).json({message: "Database error", err});
//                 }
//                 console.log(ratingResult);

//                 res.json({
//                     totalUsers: userResult[0].totalUsers,
//                     totalStores: storeResult[0].totalStores,
//                     totalRatings: ratingResult[0].totalRatings
//                 });
//             });
//         });
//     });
// });


// // To get all users
// app.get("/admin/users", verifyToken, isAdmin, (req, res)=>{

//     const sql= `select id, name, email, address, role from  users`;

//     db.query(sql, (err, result)=>{
//         if(err){
//             return res.status(500).json({message: "Database error", err});
//         }

//         res.json(result);
//     });
// });

// // To get users filter by name or email or address or role
// app.get("/admin/users/filter",verifyToken, isAdmin, (req, res)=>{
//     console.log(req.query);
//     const {name, email, address, role, sort, order} = req.query;
    
    
//     let sql =`select id, name, email, address, role from users where 1=1`;

//     const values =[];

//     if(name){
//         sql += " and name like ?";
//         values.push(`%${name}%`);
//     }

//     if(email){
//         sql += " and email like ?";
//         values.push(`%${email}%`);
//     }

//     if(address){
//         sql += " and address like ?";
//         values.push(`%${address}%`);
//     }

//     if(role){
//         sql += " and role like ?";
//         values.push(`%${role}%`);
//     }

//     const allowedFields = ["name", "email", "address", "role"];

//     if(sort && allowedFields.includes(sort)){

//         const sortOrder = order && order.toUpperCase() === "DESC"
//         ? "DESC" : "ASC";

//         sql += ` order by ${sort} ${sortOrder}`;
//     }

//     db.query(sql, values, (err, result)=>{
//         if(err){
//             return res.status(500).json({message: "Database error", err});
//         }

//         res.json(result);
//     });
// });

// // To fetch all stores
// app.get("/admin/stores", verifyToken, isAdmin, (req, res)=>{

//     const sql = `select s.id, s.name, s.email, s.address , AVG(r.rating) AS average_rating
//     from stores s
//     left join ratings r
//     on s.id = r.store_id
//     group by s.id, s.name, s.email, s.address`;

//     db.query(sql, (err, result)=>{
//         if(err){
//             return res.status(500).json({message: "Database error", err});
//         }
//         res.json(result);
//     });
// });


// // Updating password of any role who has logged in 
// app.put("/update-password",verifyToken, async (req, res)=>{
//     const {oldPassword, newPassword} = req.body;
//     const userId = req.user.id;

//     const sql = "select password from users where id = ?";

//     db.query(sql, [userId] , async (err, result)=>{
//         if(err){
//             return res.status(500).json({message: "Database error", err});
//         }

//         if(result.length === 0){
//             return res.status(404).json({message: "User not found"});
//         }
        
//         const storedPass = result[0].password;

//         const isMatch = await bcrypt.compare(oldPassword, storedPass);

//         if(!isMatch){
//             return res.status(400).json({message: "Old password is incorrect"});
//         }

//         const hashedpassword = await bcrypt.hash(newPassword, 10);

//         const updatePass = "update users set password = ? where id = ?";

//         db.query(updatePass, [hashedpassword, userId], (err)=>{
//             if(err){
//                 return res.status(500).json({message: "Database error", err});
//             }
            
//             res.json({
//                 message: "Password updated successfully"
//             });
//         });
//     });
// });

// // Implementing store search API
// app.get("/stores/search", verifyToken, (req,res)=>{
//     const {name, address} = req.query;

//     let sql=`select s.id, s.name, s.email, s.address, COALESCE(AVG(r.rating),0) as average_rating 
//     from stores s 
//     left join ratings r
//     on s.id = r.store_id
//     where 1=1`;

//     const values = [];

//     if(name){
//         sql += " and s.name like ?";
//         values.push(`%${name}%`);
//     }
//     if(address){
//         sql += " and s.address like ?";
//         values.push(`%${address}%`);
//     }

//     sql += ` group by s.id, s.name, s.email, s.address`;

//     db.query(sql, values, (err, result)=>{
//         if(err){
//             return res.status(500).json({message: "Database error", err});
//         }

//         res.json(result);
//     });
// });

// // Fetchin user by id
// app.get("/admin/users/:id", verifyToken, isAdmin, (req, res)=>{
//     const userId = req.params.id;

//     const sql = `select id, name, email, address, role from users where id = ?`;


//     db.query(sql, [userId], (err,result) =>{
//         if(err){
//             return res.status(500).json({message: "Database error", err});
//         }

//         if(result.length === 0){
//             return res.status(404).json({message: "User not found"});
//         }

//         const user = result[0];

//         if (user.role !== "OWNER") {
//             return res.json(user);
//         }

//         const ratingSql = `
//             SELECT
//                 s.id AS store_id,
//                 s.name AS store_name,
//                 COALESCE(AVG(r.rating), 0) AS average_rating
//             FROM stores s
//             LEFT JOIN ratings r
//             ON s.id = r.store_id
//             WHERE s.owner_id = ?
//             GROUP BY s.id, s.name
//         `;

//         db.query(ratingSql, [user.id], (err, ratingResult) => {

//             if (err) {
//                 return res.status(500).json({
//                     message: "Database error",
//                     err
//                 });
//             }

//             user.store = ratingResult.length > 0
//                 ? ratingResult[0]
//                 : null;

//             res.json(user);
//         });
//     });
// });


app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});

