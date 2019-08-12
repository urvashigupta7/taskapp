const express=require('express');
const router=new express.Router();
const user=require('../models/user.js');
const auth=require('../middleware/auth.js');
const multer=require('multer');
const sharp=require('sharp');
const sendmail=require('../email/account');
router.post('/users',async(req,res)=>
		{
	        try{
				const addeduser=await user.create(req.body);
				sendmail.welcome(addeduser.email,addeduser.name);
				const token=await addeduser.generatetoken();
				res.status(201).send({addeduser,token});
			}
	catch(e)
		{
			res.status(400).send(e);
		}
		 });
router.get('/users/me',auth,async(req,res)=>
	   {
	try{
		const full=await req.founduser.populate('tasks').execPopulate();
		// console.log(full.tasks);
	res.send(full);
	}
	catch(e)
		{
			res.status(500).send(e);
		}
});
router.post('/users/login',async(req,res)=>
		   {
	try{
	const founduser=await user.findByCredentials(req.body.email,req.body.password);
		const token= await founduser.generatetoken();
		res.send({founduser,token});
	}catch(e)
		{
			res.status(400).send(e);
		}
	
});
// router.get('/users/:id',async(req,res)=>
// 	   {
// 	try{
// 		const founduser=await user.findById(req.params.id);
// 		if(!founduser){
// 				res.status(404).send();
// 			}
// 		else
// 			{
// 				res.send(founduser);
// 			}
// 	}catch(e)
// 		{
// 			res.status(500).send(e);
// 		}
	
// });
router.patch('/users/me',auth,async(req,res)=>{
	const allowedupdates=['name','email','password','age'];
	const updates=Object.keys(req.body);
	const isvalidoperation=updates.every((update)=>allowedupdates.includes(update));
	if(!isvalidoperation)
		{
			return res.status(400).send('Invalid operation');
		}
	
	try{
	// const updateduser= await user.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
		
		updates.forEach((update)=>{
			req.founduser[update]=req.body[update];
		});
		const updateduser=await req.founduser.save();
				res.send(updateduser);
			}
	catch(e)
		{
			res.status(500).send(e);
		}
});
router.delete('/users/me',auth,async(req,res)=>{
	try{
		await req.founduser.remove();
		res.send(req.founduser);
		
		sendmail.cancellation(req.founduser.email,req.founduser.name);
		
	}catch(e)
		{
			res.status(500).send(e);
		}
});
router.post('/users/logout',auth,async(req,res)=>
		   {
	try{
	req.founduser.tokens=req.founduser.tokens.filter((token)=>
	{
		return token.token!==req.token;
		
	});
	await req.founduser.save();
		res.send("succeeded");
	}catch(e){
		res.status(500).send(e);
	}
	

});
router.post('/users/logoutall',auth,async(req,res)=>{
	try{
		req.founduser.tokens=[];
		await req.founduser.save();
		res.send("Logged out from all devices");
	}catch(e)
		{
			res.status(500).send(e);
		}
});
const upload=multer({
	
	limits:
	{
		fileSize:1000000
	},
	fileFilter(req,file,cb){
		if(!file.originalname.match(/\.(jpg|png|jpeg)$/))
		   {
		    return cb(new Error('Please upload an image'))
		   }
		   else{
		   cb(undefined,true);
		   }
	}
})
router.post('/users/me/avatar',auth,upload.single('images'),async(req,res)=>{
	const buffer=await sharp(req.file.buffer).resize({width:400,height:400}).toBuffer();
	req.founduser.avatar=buffer;
	await req.founduser.save();
	res.send();
},(error,req,res,next)=>{
	res.status(400).send({error:error.message});
})
router.delete('/users/me/avatar',auth,async(req,res)=>{
	req.founduser.avatar=undefined;
	await req.founduser.save();
	res.send();
})
router.get('/users/:id/avatar',async(req,res)=>{
	try{
	const founduser=await user.findById(req.params.id);
		if(!founduser||!founduser.avatar)
			{
				throw new Error();
			}
	res.set('Content-Type','image/jpg');
	res.send(founduser.avatar)
	}
	catch(e)
		{
			res.status(404).send(e);
		}
	
})
module.exports=router;
