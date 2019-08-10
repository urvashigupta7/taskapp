var mongoose=require('mongoose');
var validator=require('validator');
var bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
var task=require('./task.js');
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
		unique:true,
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
},
	tokens:[{
		token:{
			type:String,
			required:true
		}
	}]
});
userschema.virtual('tasks',{
	ref:'task',
	localField:'_id',
	foreignField:'owner'
})
userschema.pre('remove',async function(next){
	const user=this;
	await task.deleteMany({owner:user._id});
	return next();
})
userschema.methods.toJSON=function()
{
	const user=this;
	const userobject=user.toObject();
	delete userobject.tokens;
	delete userobject.password;
	return userobject;
}
userschema.statics.findByCredentials=async(email,password)=>
{
	const finduser= await user.findOne({email:email});
	if(!finduser)
		{
			throw new Error('unable to login'); 
		}
	const ismatch=await bcrypt.compare(password,finduser.password);
	if(!ismatch)
		{
			throw new Error('unable to login'); 
		}
	else{
	return finduser;
	}
};
userschema.methods.generatetoken=async function()
{
	const user=this;
	const token=jwt.sign({_id:user._id.toString()},'mynewcourse');
	user.tokens=user.tokens.concat({token});
	await user.save();
	return token;
	
};

userschema.pre('save',async function(next)
			  {
	const user=this;
	if(user.isModified('password'))
		{
			user.password=await bcrypt.hash(user.password,8);
		}
	next();
});
var user=mongoose.model('user',userschema);

module.exports=user;