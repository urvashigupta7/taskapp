var mongoose=require('mongoose');
var validator=require('validator');
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
	}
});
var task=mongoose.model('task',taskschema);
module.exports=task;