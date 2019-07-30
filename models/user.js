var mongoose=require('mongoose');
var validator=require('validator');
var userschema=new mongoose.Schema(
{
	name:
	{
		type:String,
		required:true,
		trim:true
	},
	email:
	{
	type:String,
		required:true,
		trim:true,
		lowercase:true,
		validate(value)
		{
		if(!validator.isEmail(value))
			{
				throw new Error('Email is invalid');
			}
	}
},
	password:
	{
		type:String,
		 required: true,
        minlength: 7,
        trim: true
		
	},
	age:
	{
	type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number');
            }
        }
}
});
var user=mongoose.model('user',userschema);
module.exports=user;