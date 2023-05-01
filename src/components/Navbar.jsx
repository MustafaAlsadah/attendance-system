import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom"

export default function Navbar(){

    const navigate = useNavigate()

    return(
        <div className="flex justify-between w-full bg-gray-200 p-4">
            <div className="flex justify-between  w-2/3">
                <h1 className="text-3xl">Attendance Tracker</h1>
                <Button variant="outlined" onClick={()=> navigate("/")}>My sections</Button>
                <Button variant="outlined" onClick={()=> navigate("/Profile")}>Profile</Button>
            </div>
            
        </div>
    )
}