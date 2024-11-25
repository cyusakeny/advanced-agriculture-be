const jwt = require('jsonwebtoken')
module.exports.generateToken = (email,id)=>{
    return jwt.sign({"email":email,"id":id}, "maestro", {expiresIn: '24h'})
}
module.exports.authenticateToken = (req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.json({status:401,message:'Unauthorised'})
  
    jwt.verify(token, "maestro", (err, user) => {
      console.log(err)
      if (err) return res.json({message:"Login again ",status:403})
      req.user = user
      next()
    })
}

module.exports.validateEnum=async(enumValues, value) => {
  return enumValues.includes(value);
};

module.exports.compareStrings = (str1, str2) => {
  return str1.toLowerCase() === str2.toLowerCase();
};