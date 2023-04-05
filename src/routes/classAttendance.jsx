import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx'

import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, query, orderBy, onSnapshot
         , updateDoc, getDoc } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const roasterRef = collection(db, 'roaster')
const q = query(roasterRef)

function ClassAttendance() {
  const [sectionRoaster, setSectionRoaster] = useState([])

  useEffect(()=>{
    onSnapshot(q, (snapshot)=>{
      const snapshotDocs = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
      console.log(snapshotDocs)
      setSectionRoaster(snapshotDocs)
    })
  }, [])  

  async function attendStudent(targetedStudentID){
      const docRef = doc(db, "roaster", targetedStudentID)
      const docSnap = await getDoc(docRef)
      const docSnapData = await docSnap.data()

      updateDoc(docRef, { name: docSnapData.name, id: docSnapData.id, isPresent:!docSnapData.isPresent })
      setSectionRoaster(prevRoaster => prevRoaster.map(student => student.id===targetedStudentID ? {...student, isPresent: !student.isPresent} : student))
  }

  function jsonToWorksheet(jsonData) {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    return worksheet;
  }

  function createWorkbook(jsonData) {
    const workbook = XLSX.utils.book_new();
    const worksheet = jsonToWorksheet(jsonData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    return workbook;
  }

  function downloadExcelFile(workbook, filename) {
    const binaryData = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(binaryData)], { type: 'application/octet-stream' });
    saveAs(blob, `${filename}.xlsx`);
  }
  
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }
  
  function saveAs(blob, filename) {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
  
  
  

  return (
    <div className=" ">
      {JSON.stringify(sectionRoaster)}
        <div className="flex flex-row justify-center items-center mt-4">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-3xl bg-sky-400 p-4 rounded-md text-white border-slate-500 border-4">SWE 387 Sec-1 Attendace QR:</h1>
            <Link to={'attend'}>
              <img src='https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=localhost:5173/Attend.jsx' />
            </Link>
          </div>
        </div>
        <br /><br />
        <div className="flex justify-center">
          <div className="w-3/4">
            <div className="flex  space-x-4">
                  <div className=" flex flex-col space-y-2 border-4 border-green-400 rounded p-2 w-1/2">
                      <h2>Present</h2>
                      {
                        sectionRoaster.filter(record=> record.isPresent===true)
                                      .sort((a, b)=> a.serialNo-b.serialNo)
                                      .map(record =>(
                                          <Button key={record.id} onClick={()=>attendStudent(record.id)} color={record.isPresent?"success":"error"} variant="outlined">
                                            {record.serialNo}. {record.name}
                                          </Button>
                                      ))
                      }
                  </div>
                  <div className=" flex flex-col space-y-2 border-4 border-red-400 rounded p-2 w-1/2">
                    <h2>absent</h2>
                    {
                      sectionRoaster.filter(record=> record.isPresent===false)
                                    .sort((a, b)=> a.serialNo-b.serialNo)
                                    .map(record =>(
                                        <Button key={record.id} onClick={()=>attendStudent(record.id)} color={record.isPresent?"success":"error"} variant="outlined">
                                          {record.serialNo}. {record.name}
                                        </Button>
                                    ))
                    }
                  </div>
            </div>
          </div>
        </div>
        <br /><br />
        <div className="flex justify-center mb-8">
          <Button onClick={()=>downloadExcelFile(createWorkbook(sectionRoaster), 'attendance')} variant="contained">Download Attendance</Button>
        </div>
    </div>        
  )
}



export default ClassAttendance
