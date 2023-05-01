import { Button, TextField } from "@mui/material"
import { useAuth } from "../contexts/AuthContext"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


export default function Login(props) {
    const { login, currentUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(){
        const email = document.getElementById("email-input").value
        const password = document.getElementById("pass-input").value

        try{
            setLoading(true)
            await login(email, password)
            navigate("/")
        }catch(err){
            console.log(err)
        }

        setLoading(false)
    }

    return(
        <div>
            {currentUser && <h1>Logged in {currentUser.email}</h1>}
            <div className="flex flex-col items-center justify-center space-y-10 mt-8">
                <h1 className="text-3xl">Login</h1>
                <div className="flex flex-col justify-center items-center space-y-5">
                    <TextField variant="outlined" label="Email" id="email-input"></TextField>
                    <TextField variant="outlined" label="Password" id="pass-input"></TextField>

                    <Button variant="contained" onClick={()=>handleSubmit()} disabled={loading} className="p-5" size="large">Sign in</Button>
                </div>
                <span>or</span><Button variant="text" onClick={()=>navigate("/signup")}>Create a new account</Button>
            </div>
        </div>
    )
}