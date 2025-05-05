import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import logo from '../images/tutorConnect-logo.png'


const Login = (props) => {
    const [role, setRole] = useState("");
    const [credentials,setCredentials] = useState({email:"",password:""});

    const navigator = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const {email,password} = credentials;
        try {
            const route = role==="student" ? "/api/students/login/student" : "/api/teachers/login/teacher";
            const URL = `http://localhost:4000${route}`;
            const response = await fetch(URL,{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body:  JSON.stringify({
                    email,
                    password
                })
            })
            const json  = await response.json();
            if(response.ok && json.success){
                localStorage.setItem("token",json.authToken);
                const decodedToken = jwtDecode(json.authToken);
                console.log("decoded token : ",decodedToken)
                if(role==="student"){
                    localStorage.setItem('studentid',decodedToken.student.id);
                    navigator('/student-page');
                    props.showAlert(json.message,"success");
                }else{
                    localStorage.setItem('teacherid',decodedToken.teacher.id);
                    navigator('/teacher-page');
                    props.showAlert(json.message,"success");
                }
            }else{
                console.log("Have some issues");
                props.showAlert(json.message,"danger")
            }
        } catch (error) {
            console.log("Some error occured : ",error);
        }

    }

    const handleRoleClick = (e) => {
        console.log(e.target.value)
        setRole(e.target.value);
      };

    const handleChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
      
  return (
    <div className='container'>
        <div className='card container p-3 my-3'>
        <img 
            src={logo} 
            alt="TutorConnect Logo"
            className="d-block mx-auto mb-3"
            style={{ width: "150px", height: "auto" }} 
            />
        <h1>Login : </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={handleChange}/>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="password" onChange={handleChange}/>
        </div>
        <div className='my-2'>
            <div className="form-check form-check-inline">
            <input
                className="form-check-input"
                type="radio"
                name="role"
                id="student"
                value="student"
                checked={role === "student"}
                onChange={handleRoleClick}
            />
            <label className="form-check-label" htmlFor="student">Student</label>
            </div>
            <div className="form-check form-check-inline">
            <input
                className="form-check-input"
                type="radio"
                name="role"
                id="teacher"
                value="teacher"
                checked={role === "teacher"}
                onChange={handleRoleClick}
            />
            <label className="form-check-label" htmlFor="teacher">Teacher</label>
            </div>
        </div>
        <button type="submit" className="btn btn-primary">login</button>
      </form>
    </div>
    </div>
  )
}

export default Login
