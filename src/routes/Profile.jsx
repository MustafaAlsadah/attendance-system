import { useAuth } from "../contexts/AuthContext"
import React from "react"
import { Button } from "@mui/material"

export default function Profile(){
    const { logout, currentUser } = useAuth()
    const [error, setError] = React.useState("")

    async function handleSignOut(){
        try{
            console.log(currentUser.email ,logout)
            await logout()
        }catch(err){
            setError(err.message)
        }
    }


    return(
        <div>
            <div className="border-4 border-slate-600">
                <h1 className="text-xl">Email:</h1>{currentUser.email}
            </div>
            <Button variant="outlined" color="error" onClick={()=> handleSignOut()}>Logout</Button>
            {error && <h1>{error}</h1>}
        </div>
    )
}