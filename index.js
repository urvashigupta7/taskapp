const express=require('express');
const app=express();
const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://urvashi:delhi2018@cluster0-lhmgd.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true});
const user=require('./models/user.js');
const task=require('./models/task.js');
const userRouter=require('./routes/user');
const taskRouter=require('./routes/task');

app.use(express.json());
app.use(userRouter);

app.use(taskRouter);


app.listen(3000,function()
		  {
	console.log('server has started');
});