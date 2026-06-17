const express = require('express');
const router = express.Router();

const db = require("../db/connection");
const verifyToken = require('../middleware/auth');

// To get Dashboard for owner
router.get("/owner/dashboard", verifyToken, (req, res)=>{
    const owner_id = req.user.id;
    
    const sql =`select s.id as store_id, s.name as store_name, s.address, COALESCE(AVG(r.rating), 0) AS average_rating, 
    JSON_ARRAYAGG( JSON_OBJECT( 'user_id', u.id, 'user_name', u.name, 'rating', COALESCE(r.rating, 0))) AS users_ratings from stores s 
    left join ratings r on s.id = r.store_id
    left join users u on u.id = r.user_id
    where s.owner_id = ? group by s.id, s.name, s.address`;

    db.query(sql, [owner_id], (err, result)=>{
        if(err){
            res.status(500).json({message: "Database error",err});
        }
        res.json(result);
    });
});

module.exports = router;