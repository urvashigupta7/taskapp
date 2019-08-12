const sgmail=require('@sendgrid/mail');

sgmail.setApiKey(process.env.sgapikey);
const sendmail={};
sendmail.welcome=(email,name)=>
{sgmail.send({
	to:email,
	from:'urvashi072000@gmail.com',
	subject:'this is my first email',
	text:`Welcome to the app, ${name}. Let me know how you get along with the app.`
})}
sendmail.cancellation=(email,name)=>{
	sgmail.send({
		to:email,
		from:'urvashi072000@gmail.com',
		subject:'Cancellation email',
		text:`Goodbye, ${name}. I hope to see you back sometime soon.`
	})
}
module.exports=sendmail;