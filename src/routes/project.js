const express = require('express')
const router = express.Router()
const util =require('../utils/utils')
const projectService = require('../services/project')
const { PrismaClientUnknownRequestError } = require('@prisma/client/runtime/react-native.js')

router.post('/register',util.authenticateToken,async(req,res)=>{
    var milestonesLength = 0;
    var achievements = 0;
    const milestones = req.body.milestones
    if(req.body.milestones!==null && req.body.milestones.length>0){
        milestonesLength = req.body.milestones.length
      
        for(let i=0; i<milestonesLength;i++){
            if(util.compareStrings(milestones[i].status,"COMPLETED")){
                achievements=achievements+1
            }
        }
    }
    const projectData = {
        title:req.body.title,
        type:req.body.type,
        milestonesLength:milestonesLength,
        milestones_achieved:achievements,
        description:req.body.description,
        owner_id:req.user.id,
        milestones:milestones
    }
    const response = await projectService.registerProject(projectData)
    if(response === null){
        res.json({message:"Failed to register project",status:500}).status(500)
    }
    else{
        res.json({data:response,message:"Project created",status:201}).status(201)
    }
})
router.get('/all',util.authenticateToken,async(req,res)=>{
    const all = await projectService.getAllProjects()
    res.json({data:all,message:"Projects retrieved",status:200}).status(200)
})

router.get('/getById/:id',util.authenticateToken,async(req,res)=>{
    const id = Number(req.params.id)
    const projects = await projectService.getById(id)
    res.json({data:projects,message:"Project retrieved",status:200}).status(200)
})

router.get('/stats',util.authenticateToken,async(req,res)=>{
    const id = req.user.id
    const projects = await projectService.getAllByUserId(id)
    const pendingStats = await projectService.countByUserAndStatus(id,'PENDING')
    const completedStats = await projectService.countByUserAndStatus(id,'COMPLETED')
    const cancelledStats = await projectService.countByUserAndStatus(id,'CANCELLED')
    const returnData = {
        project:projects,
        pendingStats:pendingStats,
        completedStats:completedStats,
        cancelledStats:cancelledStats,
    }
    res.json({data:returnData,message:"stats retrieved",status:200}).status(200)
})
module.exports=router
