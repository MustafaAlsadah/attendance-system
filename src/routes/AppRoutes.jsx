import { Route, Routes } from 'react-router-dom';
import Attend from './Attend';
import ClassAttendance from './classAttendance';
import Signup from './signup';
import Login from './login';
import Root from "./root";
import Profile from "./Profile";
import { useAuth } from '../contexts/AuthContext';

export default function AppRoutes() {
  const { currentUser } = useAuth() || {}; // Replace with your own authentication check

  function privateRoute(Component) {
    return currentUser ? <Component /> : <Login />;
  }

  return (
    <Routes>
      <Route exact path="/" element={privateRoute(Root)}/>
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/attend" element={privateRoute(Attend)} />
      <Route path="/classAttendance/:crn" element={privateRoute(ClassAttendance)} />      
      <Route path="/profile" element={privateRoute(Profile)} />
    </Routes>
  );
}
