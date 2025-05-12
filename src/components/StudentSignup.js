import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../images/tutorConnect-logo.png'
import image from '../images/defaultStudent.png'

const StudentSignup = (props) => {
  const [credentials,setCredentials] = useState({name:"",email:"",password:"",phoneNumber:"",location:"",fatherName:"",guardianNumber:""})
  const [file,setFile] = useState(null);

  const navigator = useNavigate();

  const handleSubmit = async(e)=>{
    e.preventDefault();
    props.setProgress(20);
    const {name,email,password,phoneNumber,location,fatherName,guardianNumber} = credentials;
    const formData = new FormData();
    formData.append('name',name);
    formData.append('email',email);
    formData.append('password',password);
    formData.append('phoneNumber',phoneNumber);
    formData.append('location',location);
    formData.append('fatherName',fatherName);
    formData.append('guardianNumber',guardianNumber);
    if(file){
      formData.append('studentImage',file);
    }
    try {
      const URL = "http://localhost:4000/api/students/register/student";
      props.setProgress(10);
      const response = await fetch(URL, {
        method:"POST",
        body: formData
      });
      props.setProgress(30);
      const json = await response.json();
      props.setProgress(50);
      if(response.ok && json.success){
        localStorage.setItem("token", json.authToken);
        localStorage.setItem('studentid',json.student._id);
        props.showAlert(json.message,"success");
        props.setProgress(100);
        navigator('/student-page');
      }else{
        console.log("Error during registration : ",json.error);
      }
    } catch (error) {
      console.log("An error occured : ",error);
    }
  }


  const onChange = (e)=>{
    if (e.target.name === 'studentImage'){
      setFile(e.target.files[0]);
    }else{
   setCredentials({...credentials,[e.target.name]:e.target.value});
    }
  }

  return (
    <div className='container'>
      <div className='card container my-3 p-3' style={{width:"100%", maxWidth:"500px", boxShadow:"0px 0px 60px #7fcaf0"}}>
      <img 
            src={logo} 
            alt="TutorConnect Logo"
            className="d-block mx-auto mb-3"
            style={{ width: "150px", height: "auto" }} 
            />
      <form onSubmit={handleSubmit}>
        <h1>Sign up to continue</h1>
        <div className="mb-3">
                    <div className='d-flex flex-column align-items-center'>
                        <div className="col-12 col-md-4 text-center mb-3">
                            <img src={image} alt="Student" className="rounded-circle img-fluid" style={{ maxWidth: '100px', height: '100px', objectFit: 'cover' }} />
                        </div>
                    </div>
                     <label htmlFor="studentImage" className="form-label">Profile</label>
                    <input type="file" className="form-control" id="studentImage" name="studentImage" onChange={onChange}/>
         </div>
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
