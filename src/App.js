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
import { useState } from 'react';
// import OutlinedAlerts from './components/OutlinedAlerts';
import LoadingBar from "react-top-loading-bar";
import  Alert from './components/Alert.js';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [alert, setAlert] = useState(null);
  const [progress,setProgress] = useState(0);
  const location = useLocation(); 

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    });
    setTimeout(() => {
      setAlert(null)
    }, 3000)
  }

  const updateProgress = (progress)=>{
    setProgress(progress);
  }

  return (
    <div className="page-container">
      <Navbar showAlert={showAlert}/>
      <LoadingBar
        color="#03045e"
        height={4}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {location.pathname !== '/' && <Alert alert={alert} />}
      {/* {location.pathname !== '/' && <Alert alert={alert}/>} */}
      <div className="content-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/choose" element={<Choose />} />
          <Route path="/teacher" element={<TeacherSignup showAlert={showAlert} setProgress={updateProgress}/>} />
          <Route path="/student" element={<StudentSignup showAlert={showAlert} setProgress={updateProgress}/>} />
          <Route path="/student-page" element={<Studentpage showAlert={showAlert} />} />
          <Route path="/teacher-page" element={<Teacherpage showAlert={showAlert} />} />
          <Route path="/login" element={<Login showAlert={showAlert} setProgress={updateProgress}/>} />
        </Routes>
      </div>
    </div>
  );
}

export default AppWrapper;
