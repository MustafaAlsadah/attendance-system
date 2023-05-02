import { initializeApp } from "firebase/app";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { app } from "./classAttendance"
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { collection, doc, getDocs, getFirestore, query, orderBy, onSnapshot
         , updateDoc, getDoc } from "firebase/firestore"

const db = getFirestore(app)

export default function Attend(props){
    const { currentUser } = useAuth()
    const { crn } = useParams();

    async function attendStudent(targetedStudentID){
        const docRef = doc(db, `users/${currentUser.email}/sections/${crn}/roster`, targetedStudentID)
        const docSnap = await getDoc(docRef)
        const docSnapData = await docSnap.data()
        console.log(docSnapData)
        updateDoc(docRef, { name: docSnapData.name, sid: docSnapData.sid, isPresent:!docSnapData.isPresent })
        // setSectionRoaster(prevRoaster => prevRoaster.map(student => student.sid===targetedStudentID ? {...student, isPresent: !student.isPresent} : student))
    }

    function handleForm(){
        const idInput = document.querySelector('#id-input')
        console.log(typeof(idInput.value))
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