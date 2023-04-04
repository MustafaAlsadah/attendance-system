import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './routes/root'
import Attend from './routes/Attend'
import ClassAttendance from './routes/classAttendance'

import '../dist/output.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
  },
  {
    path: "/attend",
    element: <Attend/>
  },
  {
    path: "/classAttendance",
    element: <ClassAttendance/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)


