import Choose from './components/Choose';
import Home from './components/Home';
import Navbar from './components/Navbar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import TeacherSignup from './components/TeacherSignup';
import StudentSignup from './components/StudentSignup';
import Studentpage from './components/Studentpage';
import Login from './components/Login';
import Teacherpage from './components/Teacherpage';
import Alert from './components/Alert';
import { useState } from 'react';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [alert, setAlert] = useState(null);
  const location = useLocation(); 

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    });
    setTimeout(() => {
      setAlert(null)
    }, 1000)
  }

  return (
    <div className="page-container">
      <Navbar />
      {location.pathname !== '/' && <Alert alert={alert} />}
      
      <div className="content-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/choose" element={<Choose />} />
          <Route path="/teacher" element={<TeacherSignup />} />
          <Route path="/student" element={<StudentSignup />} />
          <Route path="/student-page" element={<Studentpage showAlert={showAlert} />} />
          <Route path="/teacher-page" element={<Teacherpage showAlert={showAlert} />} />
          <Route path="/login" element={<Login showAlert={showAlert}/>} />
        </Routes>
      </div>
    </div>
  );
}

export default AppWrapper;
