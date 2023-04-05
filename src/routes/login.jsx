import { Button, TextField } from "@mui/material"

export default function Login(props) {
    return(
        <div>
            <div className="flex flex-col items-center justify-center space-y-10 mt-8">
                <h1 className="text-3xl">Login</h1>
                <div className="flex flex-col justify-center items-center space-y-5">
                    <TextField variant="outlined" label="Email" id="email-input"></TextField>
                    <TextField variant="outlined" label="Password" id="pass-input"></TextField>

                    <Button variant="contained" onClick={()=>console.log()} className="p-5" size="large">Sign in</Button>
                </div>
            </div>
        </div>
    )
}