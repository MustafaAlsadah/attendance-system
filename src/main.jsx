import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './routes/root'
import Attend from './routes/Attend'
import ClassAttendance from './routes/classAttendance'
import Signup from './routes/signup'
import Login from './routes/login'
import AuthProvider from './contexts/AuthContext'
import PrivateRoute from './routes/privateRouter'

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
    element: <Signup/>,
  },
  {
    path: "/attend",
    element: <Attend/>,
  },
  {
    path: "/classAttendance",
    element: <PrivateRoute exact path="/" component={ClassAttendance} />,
  },
  {
    path: "/login",
    element: <Login/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>,
)


