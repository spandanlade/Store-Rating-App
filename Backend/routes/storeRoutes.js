const express = require('express');
const router = express.Router();

const db = require("../db/connection"); 

const verifyToken = require('../middleware/auth');


// To get all stores
router.get("/stores",verifyToken,(req, res) =>{
    const  user_id = req.user.id;
    const sql = `select s.id, s.name, s.address, AVG(r.rating) as average_rating, max(case when r.user_id = ? then r.rating end) as my_rating from stores s LEFT JOIN ratings r ON s.id = r.store_id GROUP BY s.id, s.name, s.address`;
    
    db.query(sql, [user_id],(err, result)=>{
        if(err){
            return res.status(500).json({
                message:"Database error",
                err
            });
        }
        console.log(result);
        res.json(result);
    });
});

// Rating Stores 
router.post("/ratings", verifyToken, (req, res)=>{
    const user_id=req.user.id;
    const {store_id, rating}= req.body;

    // checking valid rating range
    if(rating <1 || rating >5){
        return res.status(400).json({message:"Rating must be between 1 and 5"});
    }

    // checking if user already rated or not
    const check = `select * from ratings where user_id = ? and store_id=?`;
    
    db.query(check, [user_id,store_id], (err, result)=>{
        if(err){
            return res.status(500).json({message:"Database error",err});
        }

        if(result.length >0){
            return res.status(400).json({message: "You already rated this store. Use update feature"});
        }

        // Rating Store
        const insertSql = `insert into ratings (user_id,store_id,rating) values(?,?,?)`;

        db.query(insertSql, [user_id, store_id, rating], (err, result)=>{
            if(err){
                res.status(500).json({message: "Database error", err});
            }
            res.json({message:"Rating submitted",
                ratingId:result.insertId
            });
        });
    });
});

// Update rating 
router.put("/ratings",verifyToken, (req, res)=>{
    const user_id = req.user.id;
    const {store_id, rating}=req.body;

    // checking valid rating range
    if(rating <1 || rating >5){
        return res.status(400).json({message:"Rating must be between 1 and 5"});
    }

    const updatesql = `update ratings set rating = ? where user_id=? and store_id=?`;

    db.query(updatesql, [rating,user_id, store_id], (err, result)=>{
        if(err){
            return res.status(500).json({message: "Database error", err});
        }
        if(result.affectedRows === 0 ){
            return res.status(404).json({message:"Rating not found"});
        }

        res.json({message: "Rating updated successfully"});
    });

});

// Implementing store search API
router.get("/stores/search", verifyToken, (req,res)=>{
    const {name, address} = req.query;

    let sql=`select s.id, s.name, s.email, s.address, COALESCE(AVG(r.rating),0) as average_rating 
    from stores s 
    left join ratings r
    on s.id = r.store_id
    where 1=1`;

    const values = [];

    if(name){
        sql += " and s.name like ?";
        values.push(`%${name}%`);
    }
    if(address){
        sql += " and s.address like ?";
        values.push(`%${address}%`);
    }

    sql += ` group by s.id, s.name, s.email, s.address`;

    db.query(sql, values, (err, result)=>{
        if(err){
            return res.status(500).json({message: "Database error", err});
        }

        res.json(result);
    });
});

module.exports = router;