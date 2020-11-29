var express = require('express');
var router = express.Router();
var userModel= require('../modules/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
  
router.post('/login',function(req,res,next){
    var username = req.body.username;
    userModel.find({username:username}).exec()
    .then((data)=>{
        if(data.length<1){
            res.status(404).json({
                msg:"username and password are invalid"
            })
        }else{
            bcrypt.compare(req.body.password , data[0].password , function(err,result){
                if(err){
                    res.status(404).json({
                        msg:"username and password are invalid"
                    })
                }else if(result){
                    var token = jwt.sign({ username:data[0].username , id:data[0]._id },
                    'secret',
                    { expiresIn: '1h' }
                    );
                    res.status(201).json({
                        msg:"user found",
                        token:token
                    })
                }else{
                    res.status(404).json({
                        msg:"username and password are invalid"
                    })
                }
            })
            
        }  
    })
    .catch((err)=>{
        res.json({
            msg:"error",
            result:err
        })
    })
})


router.post('/signup',function(req,res,next){
    var username = req.body.username;
    var email= req.body.email;
    var password=req.body.password;
    var conpassword=req.body.conpassword;
    if(password===conpassword){
        password= bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err){
                return res.json({
                    msg:"something went wrong.",
                    result:err
                })
            }else{
                var user_detail=new userModel({
                //_id:mongoose.Schema.Types.ObjectId,
                username:username,
                emails:email,
                password:hash
                })
                user_detail.save()
                .then((data)=>{
                    res.status(201).json({
                        msg:"User registrated successfully.",
                        result:data
                    })
                }).catch((err)=>{
                    res.json(err);
                })
            }
        });
    }else{
        res.json({
            msg:"password not matched."
        })
    }
})
 
module.exports = router;