'use client'
import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel';


import { NextRequest, NextResponse } from 'next/server'
import { getDataFormToken } from '@/helpers/getDataFormToken'

connect()

export async function GET(request: NextRequest){
    // extract data from token

    try {
        const userId = await getDataFormToken(request)
    const user = await User.findOne({_id: userId}).select("-password");

    // check if there is no user
    return NextResponse.json({
        message: "User found",
        data: user
    })


    } catch (error :any) {
        return NextResponse.json(
            { error: error.message},
            {status: 400})
    }
}