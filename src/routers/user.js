const express= require('express')
const User=require('../models/users')
const multer=require('multer')

const {sendWelcomeEmail}=require('../emails/accounts')

const router=new express.Router()
const auth=require('../middleware/auth')

router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    
    try{
    sendWelcomeEmail(user.email,user.name)
    await user.save()
    const token = await user.getAuthToken()
    res.send({user,token})
    }
    catch(e){
        res.status('400').send(e)   
    
    }

   
})

router.get('/users/me',auth,async (req,res)=>{
    try {
        const user=req.user
        const token=req.token
        res.send({user,token})
    } catch (e) {
        res.status('500').send(e)
        
    }


    
})



router.post('/users/login', async(req,res)=>{

    try {
        const user =await User.findByCredentials(req.body.email,req.body.password)
       
        const token = await user.getAuthToken()


        // res.send({user,token})
        res.send({user , token})
        
    } catch (e) {
        res.status(400).send(e)
        
    }


}) 
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!=req.token
        })

        await req.user.save()
        res.send('Logged out!')

        
    }
    catch(e){
        res.status(500).send(e)

    }
})
router.post('/users/logoutAll',auth,async (req,res)=>{
    try {
        req.user.tokens=[]
        await req.user.save()
        res.send('Logged Out!')
    } catch (e) {
        res.status(500).send(e)
        
    }
})




router.patch('/users/me',auth,async (req,res)=>{
    const allowedUpdates=['name','email','password','age']
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
        
        for(let i=0;i<updates.length;i++){
            req.user[updates[i]]=req.body[updates[i]]

        }
        await req.user.save()

        //const user= await User.findByIdAndUpdate(req.params.id,req.body,{ new:true,runValidators:true })
        // if(!user){
        //     res.status(404).send()
        // }
        res.send(req.user)
    }
    catch(e){
        res.status(500).send(e)
    }
})
router.delete('/users/me',auth, async (req,res)=>{
    try{
        // const user=await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        // res.send(user)
        await req.user.remove()
        res.send(req.user)

    }
    catch(e){
        res.status(500).send(e)
    }
})
const upload= multer({
    limits:{
        fileSize:1000000,
    },
    fileFilter(req,file,cb){
      
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image!'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    req.user.avatar=req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})


router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})


module.exports=router