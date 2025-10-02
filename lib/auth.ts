import { connectToDB } from "./db"

import { NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";

import bycrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({ 
            name: "Credentials",
            credentials:{
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },
             async authorize(credentials){
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Invalid credentials")
                }

                try{
                    await connectToDB()
                    const user = await User.findOne({email: credentials.email})

                    if(!user){
                        throw new Error("User already exists")
                    }

                    const isValid = await bycrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if(!isValid){
                        throw new Error("Invalid password")
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email
                    }
                    
                }catch(error){
                    throw error
                }
             }
    })],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id
            }
            return token
        }, //............. this is not used much 
        async session({session, token}){

            if(session.user){
                session.user.id = token.id as string
            }

            return session
        }
    },pages: {
        signIn: "/login",
        error: "/login"
    },
    session:{
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 //30 days
    },
    secret: process.env.NEXTAUTH_SECRET
}