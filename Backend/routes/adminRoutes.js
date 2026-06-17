const express = require('express');
const router = express.Router();

const db = require("../db/connection"); 
const bcrypt = require('bcrypt');

const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/roles');

// API to create USER, ADMIN or OWNER, accessible to admin only
router.post("/admin/users", verifyToken, isAdmin, async (req, res)=>{
    console.log("route hit");
    console.log(req.body);
    
    const {name,email,password, address, role } = req.body;
    
    try{

        // Validating user
        const allowedRoles =['USER', 'ADMIN', 'OWNER'];

        if(!allowedRoles.includes(role)){
            return res.status(400).json({message: "Invalid role"});
        }

        // Hashing password
        const hashedpassword = await bcrypt.hash(password, 10);

        const sql = `insert into users (name, email, password, address, role) values(?,?,?,?,?)`;

        db.query(sql, [name, email, hashedpassword, address, role], (err, result)=>{
            if(err){
                return res.status(500).json({message: "Database error", err});
            }
            res.json({message: "User created successfully",
                userId: result.inserId
            });
        });
    }
    catch (err) {
        res.status(500).json({message: "Server error", err});
        console.log(err);
    }
});

// To add stores 
router.post("/admin/stores", verifyToken, isAdmin, (req, res) =>{
    const {name, email, address, owner_id} =req.body;


    const sql =`Insert into stores (name, email, address, owner_id) values(?,?,?,?)`;

    db.query(sql,[name,email,address,owner_id],(err, result) =>{
        if(err){
            return res.status(500).json({
                message:"Database error",
                err
            });
        }
        res.json({
            message:"Store created successfully",
            storeId: result.insertId
        });
    });
});

// Admin Dashboard
router.get("/admin/dashboard", verifyToken, isAdmin, (req, res)=>{
    const users = "select count(*) as totalUsers from users";
    const stores ="select count(*) as totalStores from stores";
    const ratings ="select count(*) as totalRatings from ratings";

    db.query(users, (err, userResult)=>{
        if(err){
            return res.status(500).json({message: "Database error", err});
        }
        
        db.query(stores, (err, storeResult)=>{
            if(err){
                return res.status(500).json({message: "Database error", err});
            } 

            db.query(ratings, (err, ratingResult)=>{
                if(err){
                    return res.status(500).json({message: "Database error", err});
                }
                console.log(ratingResult);

                res.json({
                    totalUsers: userResult[0].totalUsers,
                    totalStores: storeResult[0].totalStores,
                    totalRatings: ratingResult[0].totalRatings
                });
            });
        });
    });
});

// To get all users
router.get("/admin/users", verifyToken, isAdmin, (req, res)=>{

    const sql= `select id, name, email, address, role from  users`;

    db.query(sql, (err, result)=>{
        if(err){
            return res.status(500).json({message: "Database error", err});
        }

        res.json(result);
    });
});

// To get users filter by name or email or address or role
router.get("/admin/users/filter",verifyToken, isAdmin, (req, res)=>{
    console.log(req.query);
    const {name, email, address, role, sort, order} = req.query;
    
    
    let sql =`select id, name, email, address, role from users where 1=1`;

    const values =[];

    if(name){
        sql += " and name like ?";
        values.push(`%${name}%`);
    }

    if(email){
        sql += " and email like ?";
        values.push(`%${email}%`);
    }

    if(address){
        sql += " and address like ?";
        values.push(`%${address}%`);
    }

    if(role){
        sql += " and role like ?";
        values.push(`%${role}%`);
    }

    const allowedFields = ["name", "email", "address", "role"];

    if(sort && allowedFields.includes(sort)){

        const sortOrder = order && order.toUpperCase() === "DESC"
        ? "DESC" : "ASC";

        sql += ` order by ${sort} ${sortOrder}`;
    }

    db.query(sql, values, (err, result)=>{
        if(err){
            return res.status(500).json({message: "Database error", err});
        }

        res.json(result);
    });
});

// To fetch all stores
router.get("/admin/stores", verifyToken, isAdmin, (req, res)=>{

    const sql = `select s.id, s.name, s.email, s.address , AVG(r.rating) AS average_rating
    from stores s
    left join ratings r
    on s.id = r.store_id
    group by s.id, s.name, s.email, s.address`;

    db.query(sql, (err, result)=>{
        if(err){
            return res.status(500).json({message: "Database error", err});
        }
        res.json(result);
    });
});


// Fetchin user by id
router.get("/admin/users/:id", verifyToken, isAdmin, (req, res)=>{
    const userId = req.params.id;

    const sql = `select id, name, email, address, role from users where id = ?`;


    db.query(sql, [userId], (err,result) =>{
        if(err){
            return res.status(500).json({message: "Database error", err});
        }

        if(result.length === 0){
            return res.status(404).json({message: "User not found"});
        }

        const user = result[0];

        if (user.role !== "OWNER") {
            return res.json(user);
        }

        const ratingSql = `
            SELECT
                s.id AS store_id,
                s.name AS store_name,
                COALESCE(AVG(r.rating), 0) AS average_rating
            FROM stores s
            LEFT JOIN ratings r
            ON s.id = r.store_id
            WHERE s.owner_id = ?
            GROUP BY s.id, s.name
        `;

        db.query(ratingSql, [user.id], (err, ratingResult) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    err
                });
            }

            user.store = ratingResult.length > 0
                ? ratingResult[0]
                : null;

            res.json(user);
        });
    });
});


module.exports = router;

