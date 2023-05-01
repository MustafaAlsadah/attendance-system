import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './routes/root'
import Attend from './routes/Attend'
import ClassAttendance from './routes/classAttendance'
import Signup from './routes/signup'
import Login from './routes/login'
import AuthProvider from './contexts/AuthContext'
import AppRoutes from './routes/AppRoutes'

import '../dist/output.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  ,
)


