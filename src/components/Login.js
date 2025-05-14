import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import logo from '../images/tutorConnect-logo.png'
import { Link } from 'react-router-dom';


const Login = (props) => {
    const [role, setRole] = useState("");
    const [credentials,setCredentials] = useState({email:"",password:""});

    const navigator = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const {email,password} = credentials;
        try {
            props.setProgress(0);
            const route = role==="student" ? "/api/students/login/student" : "/api/teachers/login/teacher";
            const URL = `http://localhost:4000${route}`;
            props.setProgress(30);
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
            props.setProgress(50);
            if(response.ok && json.success){
                localStorage.setItem("token",json.authToken);
                const decodedToken = jwtDecode(json.authToken);
                console.log("decoded token : ",decodedToken)
                if(role==="student"){
                    localStorage.setItem('studentid',decodedToken.student.id);
                    props.setProgress(100);
                    navigator('/student-page');
                    props.showAlert(json.message,"success");
                }else{
                    localStorage.setItem('teacherid',decodedToken.teacher.id);
                    navigator('/teacher-page');
                    props.setProgress(100);
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
        <div className='card p-3 my-3 mx-auto login-card' style={{width:"100%", maxWidth:"500px", boxShadow:"0px 0px 60px #7fcaf0"}}>
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
                style={{cursor:"pointer"}}
            />
            <label className="form-check-label" htmlFor="student" style={{cursor:"pointer"}}>Student</label>
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
                style={{cursor:"pointer"}}
            />
            <label className="form-check-label" htmlFor="teacher" style={{cursor:"pointer"}}>Teacher</label>
            </div>
        </div>
        <p>Don't have an account? <Link to="/choose">Sign up</Link></p>
        <button type="submit" className="btn btn-primary">login</button>
      </form>
    </div>
    </div>
  )
}

export default Login
