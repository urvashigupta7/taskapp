const express=require('express');
const router=new express.Router();
const user=require('../models/user.js');
router.post('/users',async(req,res)=>
		{
	        try{
				const addeduser=await user.create(req.body);
				res.status(201).send(addeduser);
			}
	catch(e)
		{
			res.status(400).send(e);
		}
		 });
router.get('/users',async(req,res)=>
	   {
	try{
	const foundusers=await user.find({});
		res.send(foundusers);
	}
	catch(e)
		{
			res.status(500).send(e);
		}
});
router.get('/users/:id',async(req,res)=>
	   {
	try{
		const founduser=await user.findById(req.params.id);
		if(!founduser){
				res.status(404).send();
			}
		else
			{
				res.send(founduser);
			}
	}catch(e)
		{
			res.status(500).send(e);
		}
	
});
router.patch('/users/:id',async(req,res)=>{
	const allowedupdates=['name','email','password','age'];
	const updates=Object.keys(req.body);
	const isvalidoperation=updates.every((update)=>allowedupdates.includes(update));
	if(!isvalidoperation)
		{
			return res.status(400).send('Invalid operation');
		}
	
	try{
	const updateduser= await user.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
		
	if(!updateduser){
		res.status(404).send();
	}else{
				res.send(updateduser);
			}
	}
	catch(e)
		{
			res.status(500).send(e);
		}
});
router.delete('/users/:id',async(req,res)=>{
	try{
		const deleteduser=await user.findByIdAndDelete(req.params.id);
		if(!deleteduser){
			 res.status(404).send();
		}
		else{
		res.send(deleteduser);
		}
	}catch(e)
		{
			res.status(500).send(e);
		}
});
module.exports=router;