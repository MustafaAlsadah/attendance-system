import { useState } from "react"
import { Button, TextField } from "@mui/material"

import { useAuth } from "../contexts/AuthContext"
import { collection, doc, getDocs, getFirestore, query, orderBy, onSnapshot
    , updateDoc, getDoc, setDoc } from "firebase/firestore"
    import { app } from "./classAttendance"
export default function Signup(props) {
    const { signup, currentUser } = useAuth() 
    const [loading, setLoading] = useState(false)

    async function handleSubmit(){
        const email = document.getElementById("email-input").value.toLowerCase()
        const name = document.getElementById("name-input").value.toLowerCase()
        const password = document.getElementById("pass-input").value.toLowerCase()
        const passwordConfirm = document.getElementById("pass-confirm-input").value.toLowerCase()

        try{
            setLoading(true)
            await signup(email, password)
            const user = {
                name: name,
                email: email
            }
            
            const db = getFirestore(app) 
            const usersCollectionRef = collection(db, 'users')
            setDoc(doc(usersCollectionRef, email), user)
            console.log("User added to database")
        }catch(error){
            throw new Error(error.message)
        }

        setLoading(false)
    }

    return(
        <div>
            {currentUser && <h1>Logged in {currentUser.email}</h1>}
            <div className="flex flex-col items-center justify-center space-y-10 mt-8">
                <h1 className="text-3xl">Signup</h1>
                <div className="flex flex-col justify-center items-center space-y-5">
                    <TextField variant="outlined" label="Email" id="email-input"></TextField>
                    <TextField variant="outlined" label="Name" id="name-input"></TextField>
                    <TextField variant="outlined" label="Password" id="pass-input"></TextField>
                    <TextField variant="outlined" label="Password Confirmation" id="pass-confirm-input"></TextField>

                    <Button disabled={loading} variant="contained" onClick={()=>handleSubmit()} className="p-5" size="large">Create Account</Button>
                </div>
            </div>
        </div>
    )
}