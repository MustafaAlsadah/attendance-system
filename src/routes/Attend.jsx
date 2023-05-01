import { initializeApp } from "firebase/app";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { app } from "./classAttendance"

import { collection, doc, getDocs, getFirestore, query, orderBy, onSnapshot
         , updateDoc, getDoc } from "firebase/firestore"

const db = getFirestore(app)

export default function Attend(props){

    async function attendStudent(targetedStudentID){
        const docRef = doc(db, "roaster", targetedStudentID)
        const docSnap = await getDoc(docRef)
        const docSnapData = docSnap.data()
  
        updateDoc(docRef, { name: docSnapData.name, id: docSnapData.id, isPresent:!docSnapData.isPresent })
    }

    function handleForm(){
        const idInput = document.querySelector('#id-input')
        attendStudent(idInput.value)
    }

    return(
        <div>
            <div className="flex flex-col items-center justify-center space-y-10 mt-8">
                <h1 className="text-3xl">Enter your KFUPM ID:</h1>
                <div className="flex items-center space-x-5">
                    <TextField variant="outlined" label="KFUPM ID" id="id-input"></TextField>
                    <Button variant="contained" onClick={()=>handleForm()} className="p-5" size="large">Attend</Button>
                </div>
            </div>
        </div>
    )
}