import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import bcryptjs from 'bcryptjs'

import { sendEmail } from '@/helpers/mailer'

import { NextRequest, NextResponse } from 'next/server'

connect()

export async function POST(request: NextRequest){
    try {

        const reqBody = await request.json()
        const {username, email, password} = reqBody

        // validation

        console.log(reqBody);
       const user = await User.findOne({email})

       if(user){
        return NextResponse.json({
            error: "User already exists",
        },{
            status:400
        })
       }

       const salt = await bcryptjs.genSalt(10);
       const hashedPassword = await bcryptjs.hash(password, salt)
      const newUser =  new User({
        username,
        email,
        password : hashedPassword
       })

       const SavedUser = await newUser.save()
       console.log(SavedUser);

       const userId = SavedUser._id

    //    send verification email

    await sendEmail({email, emailType: "VERYFY", userId:userId})

    return NextResponse.json({
        message:"User register successfully",
        sussess:true,
        SavedUser
    })


    } catch (error:any) {
        return NextResponse.json({
            error:error.message,
        },{
            status:500
        })
    }
}