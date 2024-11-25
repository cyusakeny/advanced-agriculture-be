const express = require('express')
const router = express.Router()
const util =require('../utils/utils')
const projectService = require('../services/project')
const agreementService = require('../services/agreements')

router.post('/register/:id',util.authenticateToken,async(req,res)=>{
    const project = await projectService.getById(Number(req.params.id))
    if(project===null){
        res.json({message:"project not found",status:404}).status(404)
    }
    else{
        if(req.user.id === project.owner_id){
        res.json({message:"Can't submit bit to your project",status:400}).status(400)
        }
        else{
       const agreementData = {
        title : req.body.title,
        description:req.body.description,
        ownerId:project.owner_id,
        biderId:req.user.id,
        points:req.body.points,
        projectId:project.id
       }

       const agreement = await agreementService.createAgreement(agreementData)
       if(agreement===null){
        res.json({message:"failed to make an a bid",status:500}).status(500)
       }
       else{
        res.json({data:agreement,message:"Bid submitted",status:201}).status(201)
       }
    }
    }

})
router.get('/all',util.authenticateToken,async(req,res)=>{
    const agreements = await agreementService.getAllAgreements()
    res.json({data:agreements,message:"All agreements",status:200}).status(200)
})

router.get('/allOnUser',util.authenticateToken,async(req,res)=>{
    const agreements = await agreementService.getAllAgreementsOnUser(req.user.id)
    res.json({data:agreements,message:"All agreements",status:200}).status(200)
})

router.get('/byId/:id',util.authenticateToken,async(req,res)=>{
    const id = Number(req.params.id)
    const agreement = await agreementService.getById(id)
    res.json({data:agreement,message:"All agreements",status:200}).status(200)
})
router.put('/changeStatus/:id/:status',util.authenticateToken,async(req,res)=>{
    const id = Number(req.params.id)
    const agreement = await agreementService.updateAgreement(id,req.params.status)
    res.json({data:agreement,message:"All agreements",status:200}).status(200)
})
module.exports=router