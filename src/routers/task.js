const express= require('express')
const Task=require('../models/tasks.js')
const auth=require('../middleware/auth')

const router=new express.Router()



router.post('/tasks',auth,async (req,res)=>{
    

    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try {
        const t= await task.save()
        res.send(task)
        
    } catch (e) {
        res.status('400').send(e)
    }
    // task.save().then(()=>{
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status('400').send(e)
    // })
})




router.get('/tasks/me',auth,async (req,res)=>{
    let completed=false

    if(req.query.completed){
        completed=req.query.completed==='true'
    }



    try{
    const tasks=await Task.find({owner:req.user._id,completed})
    res.send(tasks)
    }
    catch(e){
        res.status('500').send(e)
    }   


    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status('500').send(e)
    // })
})
router.get('/tasks/:id',auth,async (req,res)=>{
    const _id=req.params.id
    try {
        const task=await Task.findOne({_id,owner:req.user._id})  
        console.log(task)

        if(!task){
            return res.status('404').send()
        }
        res.send(task)
        
    } catch (e) {
        res.status('500').send(e)
        
    }
    



    // Task.findById(_id).then((task)=>{
    //     if(!task)
    //     return res.status('407').send()
    //     res.send(task)

    // }).catch((e)=>{
    //     res.status('500').send(e)
    // })
})

router.patch('/tasks/me/:id',auth,async (req,res)=>{
    
        const allowedUpdates=['name','completed']
        const updates=Object.keys(req.body)
        var valid = true
    for(let j=0;j<updates.length;j++){
        for(let k=0;k<allowedUpdates.length;k++){
            if(updates[j]===allowedUpdates[k])
            {
                valid=true
                break
            }
            valid=false
        }
        if(valid===false)
        break
    }
    if(!valid)
    return res.status('400').send("Invalid Updates!")
    try{


        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        



        
        if(!task){
            res.status(404).send()
        }
        
        for(let i=0;i<updates.length;i++){
            task[updates[i]]=req.body[updates[i]]
            
        }
        
        await task.save()
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})
router.delete('/tasks/me/:id',auth,async (req,res)=>{
    try{
        const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)

    }
    catch(e){
        res.status(500).send(e)
    }
})
module.exports = router
