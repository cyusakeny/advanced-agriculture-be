const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports.createAgreement = async(agreementData)=>{
    try{
        const agreementDetails = await prisma.$transaction(async(tx)=>{
            const agreement = await tx.agreement.create({
                data:{
                    title:agreementData.title,
                    description:agreementData.description,
                    bider_status:'ACCEPTED',
                    owner_status:'PENDING',
                    status:'PENDING',
                    project_owner_id:agreementData.ownerId,
                    bid_submitter_id:agreementData.biderId,
                    project_id:agreementData.projectId,
                    agreement_points:{
                        create:agreementData.points.map((point,index)=>({
                            description:point.description,
                            owner_status:'ACCEPTED',
                            bider_status:'ACCEPTED'
                        }))
                    }
                }
            })
            return agreement
        })
        return agreementDetails
    }
    catch(error){
        console.log("error in agreement creation :",error)
    }
}

module.exports.getAllAgreements = async()=>{
    const agreements = await prisma.agreement.findMany({
        include:{
            project:true,
            agreement_points:true
        }
    })
    return agreements
}

module.exports.getAllAgreementsOnUser = async(id)=>{
    const agreements = await prisma.agreement.findMany({
        where:{
            OR:[
                {project_owner_id:id},
                {bid_submitter_id:id}
            ]
        },
        select:{
            title:true,
            id:true,
            description:true,
            status:true
        }
    })
    return agreements
}

module.exports.getById = async(id)=>{
    const agreement = await prisma.agreement.findUnique({
        where:{
            id:id
        },
        include:{
            project:true,
            agreement_points:true
        }
    })
    return agreement
}
module.exports.updateAgreement = async(id,status)=>{
    const agreement = await prisma.agreement.update({
        where:{
            id:id
        },
        data:{
            owner_status:status,
            status:status
        }
    })
    return agreement
}

