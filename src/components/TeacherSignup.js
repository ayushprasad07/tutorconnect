import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../images/tutorConnect-logo.png'

const TeacherSignup = () => {
    const [credentials, setCredentials] = useState({
        name: "", email: "", password: "", phoneNumber: "",
        subject: "", chargesPerHour: "", bio: "", location: ""
      });      
    
    let navigation = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const {name,email,password,phoneNumber,subject,chargesPerHour,bio,location} = credentials;
        const URL = "http://localhost:4000/api/teachers/register/teacher"
        try {
            const response = await fetch(URL,{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    phoneNumber: Number(phoneNumber),
                    subject,
                    chargesPerHour: Number(chargesPerHour),
                    bio,
                    location
                })
            });

            const json = await response.json();

            if(response.ok && json.success){
                localStorage.setItem('token', json.authToken);
                navigation('/');
            } else {
                console.error("Error during registration:", json.error);
            }

        } catch (error) {
            console.error("An error occurred during the request:", error);
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }

  return (
    <div className='container'>
        <div className='card container border-1 my-3 p-3'>
        <img 
            src={logo} 
            alt="TutorConnect Logo"
            className="d-block mx-auto mb-3"
            style={{ width: "150px", height: "auto" }} 
            />
        <h1>Sign up to Continue</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" name="name" onChange={onChange}/>
        </div>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="email" onChange={onChange}/>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="password" onChange={onChange}/>
        </div>
        <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input type="number" className="form-control" id="phoneNumber" name="phoneNumber" onChange={onChange}/>
        </div>
        <div className="mb-3">
            <label htmlFor="subject" className="form-label">Subject</label>
            <input type="text" className="form-control" id="subject" name="subject" onChange={onChange}/>
        </div>
        <div className="mb-3">
            <label htmlFor="chargesPerHour" className="form-label">Charges per hour</label>
            <input type="number" className="form-control" id="chargesPerHour" name="chargesPerHour" onChange={onChange}/>
        </div>
        <div className="mb-3">
            <label htmlFor="bio" className="form-label">Bio</label>
            <input type="text" className="form-control" id="bio" name="bio" onChange={onChange}/>
        </div>
        <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input type="text" className="form-control" id="location" name="location" onChange={onChange}/>
        </div>
        <button type="submit" className="btn btn-primary">Create Account</button>
      </form>
    </div>
    </div>
  )
}

export default TeacherSignup
