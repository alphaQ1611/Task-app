const sgMail= require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)



const sendWelcomeEmail=(email,name)=>{
sgMail.send({
    to:email,
    from:'sayam.samsung1611@gmail.com',
    subject:"Welcome!",
    text:`Welcome ${name},Thanks for joining in.Let me know how you get along this App`
})

}
module.exports ={
    sendWelcomeEmail
}
