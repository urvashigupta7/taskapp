var mongoose=require('mongoose');
var validator=require('validator');
var user=require('./user.js');
var taskschema=new mongoose.Schema({
	description:
	{
		type:String,
		required:true,
		trim:true
	},
	completed:
	{
		type:Boolean,
		default:false
	},
	owner:{
		type:mongoose.Schema.Types.ObjectId,
		required:true,
		ref:'user'
	}
});
var task=mongoose.model('task',taskschema);
module.exports=task;