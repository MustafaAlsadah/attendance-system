import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Modal } from "@mui/material";
import * as XLSX from 'xlsx'
import { useParams } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, query, orderBy, onSnapshot
         , updateDoc, getDoc, addDoc, setDoc } from "firebase/firestore"
import Navbar from "../components/Navbar";
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from "uuid";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY, 
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID, 
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

function ClassAttendance() {
  const { crn } = useParams();
  const db = getFirestore(app)
  const { currentUser } = useAuth()

const roasterRef = collection(db, `users/${currentUser.email}/sections/${crn}/roster`)
const q = query(roasterRef)

  const [sectionRoaster, setSectionRoaster] = useState([])
  const [modalOpen, setModalOpen] = useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  useEffect(()=>{
    onSnapshot(q, (snapshot)=>{
      console.log()
      const snapshotDocs = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
      setSectionRoaster(snapshotDocs)
    })
  }, [])  

  console.log(sectionRoaster)



  const readIds = async (collection, ids) => {
    const reads = ids.map(id => getDoc(doc(collection, id)));
    const result = await Promise.all(reads);
    return result.map(v => v.data());
  }


  async function attendStudent(targetedStudentID){
      const docRef = doc(db, `users/${currentUser.email}/sections/${crn}/roster`, targetedStudentID)
      const docSnap = await getDoc(docRef)
      const docSnapData = await docSnap.data()
      console.log(docSnapData)
      updateDoc(docRef, { name: docSnapData.name, sid: docSnapData.sid, isPresent:!docSnapData.isPresent })
      setSectionRoaster(prevRoaster => prevRoaster.map(student => student.sid===targetedStudentID ? {...student, isPresent: !student.isPresent} : student))
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


  function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const roster = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
      if (currentUser) {
        try {
          const docRefs = [];
          const headers = roster[0].slice(1); // skip first column with "SID" label
          for (const student of roster.slice(1)) { // skip first row with headers
            const sid = student[3];
            const studentObj = {};
            headers.forEach((header, index) => {
              if (header === 'isPresent') {
                studentObj[header] = student[index+1] === 'TRUE';
              } else {
                studentObj[header] = student[index+1];
              }
            });
            const docRef = await setDoc(doc(collection(db, `users/${currentUser.email}/sections/${crn}/roster`), sid), studentObj);
            docRefs.push(docRef);
          }
          console.log('Roster uploaded successfully:', docRefs.map((docRef) => docRef.id));
        } catch (error) {
          console.error('Error uploading roster:', error);
        }
      } else {
        console.error('User is not signed in');
      }
    };
    reader.readAsArrayBuffer(file);
  }
  
  

  function convertNestedArrayToJSON(nestedArray) {
    const headers = nestedArray[0];
    const data = nestedArray.slice(1);
    const jsonArray = [];
  
    for (let i = 0; i < data.length; i++) {
      const currentRow = data[i];
      const jsonObject = {};
  
      for (let j = 0; j < headers.length; j++) {
        const currentHeader = headers[j];
        const currentCellData = currentRow[j];
        jsonObject[currentHeader] = currentCellData;
      }
  
      jsonArray.push(jsonObject);
    }
  
    return jsonArray;
  }
  
  
  
  
  

  return (
    <div className=" ">
      <Navbar />
        <div className="flex flex-row justify-center items-center mt-4">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-3xl bg-sky-400 p-4 rounded-md text-white border-slate-500 border-4">{"{CRN: "+crn+"}"} SWE 387 Sec-1 Attendace QR:</h1>
            <Link to={'/Attend'}>
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
                                          <Button key={record.sid} onClick={()=>attendStudent(record.sid)} color={record.isPresent?"success":"error"} variant="outlined">
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
                                        <Button key={record.sid} onClick={()=>attendStudent(record.sid)} color={record.isPresent?"success":"error"} variant="outlined">
                                          {record.serialNo}. {record.name}
                                        </Button>
                                    ))
                    }
                  </div>
            </div>
          </div>
        </div>
        {JSON.stringify(sectionRoaster)}

        <br /><br />
        <div className="flex justify-center mb-8">
          <Button onClick={()=>downloadExcelFile(createWorkbook(sectionRoaster), 'attendance')} variant="contained">Download Attendance</Button>
          <Button variant="outlined" color="primary" onClick={handleOpen}>
            Upload Roster
          </Button>
          <Modal open={modalOpen} onClose={handleClose}>
          <Box sx={style}>
            <div>
              <input type="file" accept=".xlsx,.xls,.csv" onChange={(e)=>handleFileUpload(e)} />
            </div>
            </Box>
          </Modal>
        </div>
        
    </div>        
  )
}



export default ClassAttendance
