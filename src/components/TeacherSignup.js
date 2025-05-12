import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../images/tutorConnect-logo.png'
import image from '../images/defaultTeacher.jpg';


const TeacherSignup = (props) => {
    const [credentials, setCredentials] = useState({
        name: "", email: "", password: "", phoneNumber: "",
        subject: "", chargesPerHour: "", bio: "", location: ""
      });    
    const [file,setFile] = useState(null);  
    
    let navigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        props.setProgress(20);
        const { name, email, password, phoneNumber, subject, chargesPerHour, bio, location } = credentials;
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phoneNumber', phoneNumber);
        formData.append('subject', subject);
        formData.append('chargesPerHour', chargesPerHour);
        formData.append('bio', bio);
        formData.append('location', location);
        
        if (file) {
            formData.append('teacherImage', file);
        }

        const URL = "http://localhost:4000/api/teachers/register/teacher";

        try {
            const response = await fetch(URL, {
            method: "POST",
            body: formData,
            });
            props.setProgress(40);
            const json = await response.json();
            props.setProgress(50);
            if (response.ok && json.success) {
            console.log("Registration Successful, token:", json.authToken); 
            localStorage.setItem('teacherid',json.teacher._id);
            localStorage.setItem('token', json.authToken);
            props.showAlert(json.message, "success");
            props.setProgress(100);
            navigation('/teacher-page');
            } else {
            console.error("Error during registration:", json.error);
            props.showAlert(json.message, "danger");
            }
        } catch (error) {
            console.error("An error occurred during the request:", error);
            props.showAlert("An error occurred", "danger");
        }
        };

    const onChange = (e)=>{
        if(e.target.name === 'teacherImage'){
            setFile(e.target.files[0]);
        }else{
            setCredentials({...credentials,[e.target.name]:e.target.value})
        }
    }

  return (
    <div className='container'>
        <div className='card container border-1 my-3 p-3' style={{width:"100%", maxWidth:"500px", boxShadow:"0px 0px 60px #7fcaf0"}}>
        <img 
            src={logo} 
            alt="TutorConnect Logo"
            className="d-block mx-auto mb-3"
            style={{ width: "150px", height: "auto" }} 
            />
        <h1>Sign up to Continue</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <div className='d-flex flex-column align-items-center'>
                <div className="col-12 col-md-4 text-center mb-3">
                    <img src={image} alt="Teacher" className="rounded-circle img-fluid" style={{ maxWidth: '100px', height: '100px', objectFit: 'cover' }} />
                </div>
            </div>
             <label htmlFor="teacherImage" className="form-label">Profile</label>
            <input type="file" className="form-control" id="teacherImage" name="teacherImage" onChange={onChange}/>
        </div>
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