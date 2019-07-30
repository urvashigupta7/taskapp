const express=require('express');
const router=new express.Router();
const task=require('../models/task.js');

router.post('/tasks',async(req,res)=>
		{
	        try{
				const addedtask=await task.create(req.body);
				res.status(201).send(addedtask);
			}
	catch(e)
		{
			res.status(400).send(e);
		}
		 });
router.get('/tasks',(req,res)=>
	   {
	task.find({}).then((result)=>
					  {
		res.status(201).send(result);
	}).catch((e)=>
			{
		res.status(500).send(e);
	});
});
router.get('/tasks/:id',async(req,res)=>
	   {
	try{
		const foundtask=await task.findById(req.params.id);
		if(!foundtask)
			{
				res.status(404).send();
			}
		else
			{
				res.send(foundtask);
			}
	}catch(e)
		{
			res.status(500).send(e);
		}
});

router.patch('/tasks/:id',async(req,res)=>
		 {
	const allowedupdates=['description','completed'];
	const updates=Object.keys(req.body);
	const isvalidoperation=updates.every((update)=>allowedupdates.includes(update));
	if(!isvalidoperation)
		{
			return res.status(400).send('Invalid Operation');
		}
	try{
		const updatedtask=await task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
		if(!updatedtask)
			{
				res.status(404).send();
			}
		else
			{
				res.send(updatedtask);
			}
	}
	catch(e){
		res.status(500).send(e);
	}
});

router.delete('/tasks/:id',async(req,res)=>{
	try{
		const deletedtask=await task.findByIdAndDelete(req.params.id);
		if(!deletedtask){
			 res.status(404).send();
		}
		else{
		res.send(deletedtask);
		}
	}catch(e)
		{
			res.status(500).send(e);
		}
});
module.exports=router;