import * as React from 'react';
import { Button, CardActionArea, CardActions, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


import CourseCard from '../components/CourseCard';
import Navbar from '../components/Navbar';
import { collection, doc, getDocs, getFirestore, query, orderBy, onSnapshot
  , updateDoc, getDoc, addDoc, setDoc } from "firebase/firestore"
  import { app } from "./classAttendance"
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';



function Root() {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  let [userCourses, setUserCourses] = useState([])

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
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
  

  const db = getFirestore(app)
  const instructorDocRef = doc(db, `users/${currentUser.email}`)
  const instructorCoursesRef = collection(instructorDocRef, `users/${currentUser.email}/sections`);
  const q = query(instructorCoursesRef)

  useEffect(()=>{
    const unsupscribe = onSnapshot(q, (snapshot) => {
      const snapshotDocs = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
      setUserCourses(snapshotDocs)
      console.log(userCourses, snapshotDocs, currentUser.email)
    })

    return () => unsupscribe();
  }, [openModal])  
  

  //function to add a section to the user's sections collection and (creates the sub-collection if not yet created) and update the user's courses state 
  async function handleaAddSection(courseName, courseCode, courseSectionNo, crn){
    const newCourseRef = doc(instructorCoursesRef, crn)
    const newCourseData = {courseName: courseName, courseCode: courseCode, courseSectionNo:courseSectionNo, crn: crn}
    setDoc(newCourseRef, newCourseData)
      .then(() => {
        console.log("Document written");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  return (
    <div>
      <Navbar />
      <div className="m-6 space-y-8">
        <div className="flex justify-center">
          <div className="flex justify-around w-2/3">
            <h1 className="text-5xl">Welcome Mustafa!</h1>
            <Button variant="outlined" onClick={handleOpenModal}>Add sections</Button>
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div className="flex flex-col justify-center items-center space-y-5">
                      <TextField variant="outlined" label="Course Name" id="course-name-input"></TextField>
                      <TextField variant="outlined" label="Course Code" placeholder='exp. MATH 101' id="course-code-input"></TextField>
                      <TextField variant="outlined" label="Section no." placeholder='exp. 2' id="course-section-no"></TextField>
                      <TextField variant="outlined" label="CRN" placeholder='exp. 32440' id="crn-input"></TextField>

                      <Button disapled={loading}  variant="contained"  className="p-5" size="large" onClick={async ()=>{
                        const courseName = document.getElementById('course-name-input').value.toLowerCase()
                        const courseCode = document.getElementById('course-code-input').value.toUpperCase()
                        const courseSectionNo = document.getElementById('course-section-no').value.toLowerCase()
                        const crn = document.getElementById('crn-input').value.toLowerCase()
                        try{
                          setLoading(true)
                          await handleaAddSection(courseName, courseCode, courseSectionNo, crn)
                          setLoading(false)
                          handleCloseModal()
                        }catch(e){
                          throw new Error(e.message)
                        }
                      }}>Add Course</Button>
                  </div>
              </Box>
            </Modal>
          </div>
        </div>

        <div id="my-sections" className='grid grid-cols-3 gap-6'>
          {userCourses.map((course) => (<CourseCard imageUrl="pmp.jpg" className={course.courseCode + " - " + course.courseSectionNo} crn={course.crn} key={course.crn} />))}
        </div> 
      </div>
    </div>
  )
}



export default Root
