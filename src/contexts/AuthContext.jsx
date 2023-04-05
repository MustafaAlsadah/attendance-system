import React, { useContext, useEffect, useState } from "react";
import { getAuth } from 'firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { app } from '../routes/classAttendance'

export const AuthContext = React.createContext() 
const auth = getAuth(app);

export function useAuth() {
    return useContext(AuthContext)
}

export default function AuthProvider({ children }){
    const [currentUser, setCurrentUser] = useState()

    function signup(email, password){
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        })

        return unsubscribe
    })

    return (
        <AuthContext.Provider value={{currentUser, signup}}>
            {children}
        </AuthContext.Provider>
    )
}

