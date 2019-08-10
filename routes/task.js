const express=require('express');
const router=new express.Router();
const task=require('../models/task.js');
const auth=require('../middleware/auth.js');

router.post('/tasks',auth,async(req,res)=>
		{
	
	
	        try{
				req.body.owner=req.founduser._id;
				const addedtask=await task.create(req.body);
				const full=await addedtask.populate('owner').execPopulate();
			
				res.status(201).send(addedtask);
			}
	catch(e)
		{
			res.status(400).send(e);
		}
		 });
router.get('/tasks',auth,(req,res)=>
	   {
	task.find({owner:req.founduser._id}).then((result)=>
					  {
		res.status(201).send(result);
	}).catch((e)=>
			{
		res.status(500).send(e);
	});
});
router.get('/tasks/:id',auth,async(req,res)=>
	   {
	try{
		const foundtask=await task.findOne({_id:req.params.id,owner:req.founduser._id});
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

router.patch('/tasks/:id',auth,async(req,res)=>
		 {
	const allowedupdates=['description','completed'];
	const updates=Object.keys(req.body);
	const isvalidoperation=updates.every((update)=>allowedupdates.includes(update));
	if(!isvalidoperation)
		{
			return res.status(400).send('Invalid Operation');
		}
	try{
		const tobeupdated=await task.findOne({_id:req.params.id,owner:req.founduser._id});
		if(!tobeupdated)
			{
				res.status(404).send();
			}
		else
			{
				updates.forEach((update)=>
							   {
					tobeupdated[update]=req.body[update];
				});
				await tobeupdated.save();
				res.send(tobeupdated);
			}
		
	}
	catch(e){
		res.status(500).send(e);
	}
});

router.delete('/tasks/:id',auth,async(req,res)=>{
	try{
		const deletedtask=await task.findOneAndDelete({_id:req.params.id,owner:req.founduser._id});
		if(!deletedtask){
			return res.status(404).send();
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