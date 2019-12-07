const express=require('express')
require('./db/mongoose')
const User=require('./models/users')
const Task=require('./models/tasks')
const app=express()
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
const port=process.env.PORT






app.listen(port,()=>{
    console.log("The server is up and running!")
    
})
