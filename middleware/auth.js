const jwt=require('jsonwebtoken');
const user=require('../models/user.js');
const auth=async function(req,res,next)
{
	try{
	const token=req.header('Authorization').replace('Bearer ','');
	const decoded=jwt.verify(token,process.env.jwtsecretkey);
	const founduser=await user.findOne({_id:decoded._id,'tokens.token':token});
	if(!founduser)
		{
			throw new Error();
		}
		req.founduser=founduser;
		req.token=token;
	next();
	}catch(e)
		{
			res.status(401).send('Please authenticate');
		}
	
};
module.exports=auth;