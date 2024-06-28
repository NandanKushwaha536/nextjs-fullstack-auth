import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'

export const sendEmail = async({email, emailType, userId}:any) => {
    try {
       
      const hashedToken = await bcryptjs.hash(userId.toString(), 10)

if(emailType === "VERIFY"){
    const updateUser= await User.findByIdAndUpdate(userId,{
        $set: {
            verifyToken:hashedToken, 
            verifyTokenExpiry: new Date(Date.now() + 3600000) 
        }
    })

    console.log("update user for verify", updateUser)
    
}else if(emailType === "RESET"){
    await User.findByIdAndUpdate(userId,{
        $set: {
            forgotPasswordToken:hashedToken, 
            forgotPasswordTokenExpiry: new Date(Date.now() + 3600000)
        }
    })
}

var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5c2ccd944eea69",
      pass: "62274c140ce07d"
    }
  });

const mailOptions = {
    from: 'chandanhp099@gmail.com', // sender address
    to: email, // list of receivers
    subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
    html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a>
     to ${ emailType === "VERIFY" ? "Verify your email" : "Reset your password"} 
     reset your password or copy and paste the link below in your browser.
    <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
    </p>`
}
 const mailResponse = await transport.sendMail(mailOptions)
 return mailResponse;

    } catch (error:any) {
        throw new Error(error.message)
    }
}