import { initializeApp } from "firebase/app";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { collection, doc, getDocs, getFirestore, query, orderBy, onSnapshot
         , updateDoc, getDoc } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2oAaPEYK2AjlGIXiUbNDw11wCV6lVu8o",
  authDomain: "attendance-system-572e3.firebaseapp.com",
  projectId: "attendance-system-572e3",
  storageBucket: "attendance-system-572e3.appspot.com",
  messagingSenderId: "358203249853",
  appId: "1:358203249853:web:4280b1c2c259496b6e13d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const roasterRef = collection(db, 'roaster')

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