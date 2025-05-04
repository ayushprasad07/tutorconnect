import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../images/tutorConnect-logo.png'

const StudentSignup = () => {
  const [credentials,setCredentials] = useState({name:"",email:"",password:"",phoneNumber:"",location:"",fatherName:"",guardianNumber:""})

  const navigator = useNavigate();

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const {name,email,password,phoneNumber,location,fatherName,guardianNumber} = credentials;
    try {
      const URL = "http://localhost:4000/api/students/register/student";
      const response = await fetch(URL, {
        method:"POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phoneNumber:Number(phoneNumber),
          location,
          fatherName,
          guardianNumber:Number(guardianNumber)
        })
      });
  
      const json = await response.json();
      if(response.ok && json.success){
        localStorage.setItem("token", json.authToken);
        navigator('/student-page');
      }else{
        console.log("Error during registration : ",json.error);
      }
    } catch (error) {
      console.log("An error occured : ",error);
    }
  }


  const onChange = (e)=>{
    setCredentials({...credentials,[e.target.name]:e.target.value});
  }
  return (
    <div className='container'>
      <div className='card container my-3 p-3'>
      <img 
            src={logo} 
            alt="TutorConnect Logo"
            className="d-block mx-auto mb-3"
            style={{ width: "150px", height: "auto" }} 
            />
      <form onSubmit={handleSubmit}>
        <h1>Sign up to continue</h1>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" aria-describedby="emailHelp" onChange={onChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange}/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" onChange={onChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone number</label>
          <input type="number" className="form-control" id="phoneNumber" name="phoneNumber" onChange={onChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <input type="text" className="form-control" id="location" name='location' aria-describedby="emailHelp" onChange={onChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="fatherName" className="form-label">Father's Name</label>
          <input type="text" className="form-control" id="fatherName" name='fatherName' aria-describedby="emailHelp" onChange={onChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="guardianNumber" className="form-label">Guardian Number</label>
          <input type="number" className="form-control" id="guardianNumber" name='guardianNumber' aria-describedby="emailHelp" onChange={onChange}/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
    </div>
  )
}

export default StudentSignup
