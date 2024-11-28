const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports.registerProject = async(projectData)=>{
   try{
    const newProject = await prisma.$transaction(async(tx)=>{
   const project = await tx.project.create({
    data:{
        title:projectData.title,
        status:"PENDING",
        type:projectData.type,
        milestones:projectData.milestonesLength,
        milestones_achieved:projectData.achievements,
        description:projectData.description,
        owner_id:projectData.owner_id,
        project_milestones:{
            create:projectData.milestones.map((milestone,index)=>({
                description:milestone.description,
                status:milestone.status
            }))
        }
    },
    include:{
        project_milestones:true,
        owner:true
    }
   })
   return project
   })
   return newProject
}
catch(error){
    console.log(error)
    return null;
}
}
module.exports.getAllProjects = async()=>{
    const projects = await prisma.project.findMany(
        {
            select:{
                id:true,
                title:true,
                description:true
            }
        }
    )
    return projects
}
module.exports.getById = async(id)=>{
    const projects = await prisma.project.findUnique({
        where:{
            id:id
        },
        include:{
            project_milestones:{
                select:{
                    status:true,
                    description:true
                }
            },
            owner:{
                select:{
                    name:true,
                    email:true
                }
            }
        }
    })
    return projects
}

module.exports.getAllByUserId = async(id)=>{
    const projects = await prisma.project.findMany({
        where:{
            owner_id:id
        }
    })
    return projects
}

module.exports.countByUserAndStatus = async(id,status)=>{
    const count = await prisma.project.count({
        where:{
            AND:[
                {owner_id:id},
                {status:status}
            ]
        }
    })
    return count
}
module.exports.updateProjectStatus = async(id, status)=>{
    const project = await prisma.project.update({
        where:{
            id:id
        },
        data:{
            status:status
        }
    })
}