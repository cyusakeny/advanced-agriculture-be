const express = require('express')
const router = express.Router()
const util =require('../utils/utils')
const userService = require('../services/users')

router.post('/register',async(req,res)=>{
    const user = {
        name:req.body.name,
        email: req.body.email,
        password: req.body.password,
        description:req.body.description
    }
    const createdUser = await userService.register(user)
    if(createdUser===null){
        res.json({message:"Can't register user",status:500}).status(500);
    }
    else{
    const token = util.generateToken(createdUser.email,createdUser.id)
    res.json({data:createdUser,token:token,message:"User successfully created",status:201}).status(201);
    }
})

router.get('/',util.authenticateToken,async(req,res)=>{
    const users = await userService.getUsers()
    res.json({data:users,message:"All Users",status:200}).status(200);
})

router.post('/login',async(req,res)=>{
    const credentials = {
        email:req.body.email,
        password:req.body.password
    }
    const user = await userService.login(credentials)
    if(user===null){
        res.json({data:null,message:"Invalid credentials",status:404}).status(404);
    }
    else{
        const token = util.generateToken(user.email,user.id)
        res.json({data:user,token:token,message:"Logged in",status:200}).status(200)
    }
})



module.exports=router