const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_secret = "mysecretkey";
const db = require("../db/connection"); 

const verifyToken = require('../middleware/auth')

// Register, for user
router.post("/register", async (req, res) => {
    const {name, email, password, address} = req.body;

    // check valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            message: "Invalid email format"
        });
    }

    // checking if user already exist or not
    const  checkUser = "select * from users where email = ?";

    db.query(checkUser,[email], async (err, result) => {
        if(err) {
            return res.status(500).json({message: "Database error", err});
        }

        if(result.length > 0) {
            return res.status(400).json({
                message: "Email already exist"
            });
        }

        // hashing passoword using bcrypt
        const hashedpassword = await bcrypt.hash(password, 10);

        const sql = `insert into users (name, email, password, address, role) values (?,?,?,?,'USER')`;

        db.query(sql, [name, email, hashedpassword, address], (err, result) => {
            if(err){
                return res.status(500).json(err);
            }
            res.json({
                message: "User registered successfully",
                userId: result.insertId
            });
        });
    });

});


// Login API
router.post("/login", (req, res) => {
    const {email, password} = req.body;

    // Finding users details by using email
    const sql = "select * from users where email=?";

    db.query(sql, [email], async(err, result) =>{
        if(err){
            return res.status(500).json({message: "Database error", err});
        }

        // checking if user exist or not
        if(result.length===0){
            return res.status(400).json({message:"Invalid email or password"});
        }

        const user = result[0];

        // Comparing password with hash
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"});
        }

        // Generating jwt token
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role:user.role
        },jwt_secret, {expiresIn:"1h"});

        res.json({
            message:"Login Successful",
            token
        });
    });
});

// Updating password of any role who has logged in 
router.put("/update-password",verifyToken, async (req, res)=>{
    const {oldPassword, newPassword} = req.body;
    const userId = req.user.id;

    const sql = "select password from users where id = ?";

    db.query(sql, [userId] , async (err, result)=>{
        if(err){
            return res.status(500).json({message: "Database error", err});
        }

        if(result.length === 0){
            return res.status(404).json({message: "User not found"});
        }
        
        const storedPass = result[0].password;

        const isMatch = await bcrypt.compare(oldPassword, storedPass);

        if(!isMatch){
            return res.status(400).json({message: "Old password is incorrect"});
        }

        const hashedpassword = await bcrypt.hash(newPassword, 10);

        const updatePass = "update users set password = ? where id = ?";

        db.query(updatePass, [hashedpassword, userId], (err)=>{
            if(err){
                return res.status(500).json({message: "Database error", err});
            }
            
            res.json({
                message: "Password updated successfully"
            });
        });
    });
});

module.exports = router;