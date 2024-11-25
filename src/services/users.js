const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports.register = async(user)=>{
   try{

    const registeredUser = await prisma.user.create({
    data:{
      name:user.name,
      email:user.email,
      password:user.password,
      description:user.description
    }
   })
   return registeredUser;
}
   catch(error){
    console.log(error)
    return null
   }
}
module.exports.getUsers = async()=>{
    const users = await prisma.user.findMany({
        select:{
            id:true,
            name:true,
            description:true,
            email:true
        }
    });
    return users;
}
module.exports.login = async(credentials)=>{
    const user = await prisma.user.findFirst({
        where:{
            AND:[
                {email:credentials.email},
                {password:credentials.password}
            ]
        }
    })
    return user;
}
