import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from '../images/defaultStudent.png';
import logo from '../images/tutorConnect-logo.png';

const Navbar = () => {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [update,setUpdate] = useState({});
  const navigator = useNavigate();
  const ref = useRef();
  const editref = useRef();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentid');
    localStorage.removeItem('teacherid');
    setUser({});
    setIsLoggedIn(false);
    navigator('/');
  };

  const handleClick = () => {
    ref.current.click();
  };

  const handleEdit = () => {
    setUpdate(user);
    editref.current.click();
  };

  const getTeacher = async () => {
    try {
      const teacherId = localStorage.getItem('teacherid');
      const URL = `http://localhost:4000/api/teachers/get/${teacherId}`;
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log("Teachers details : ",data);
      setUser(data.teacher);
    } catch (error) {
      console.log('Some error occurred', error);
    }
  };

  const handleUpdate = ()=>{
    if(localStorage.getItem('teacherid')){
      updateTeacherProfile();
    }else{
      updateStudentProfile();
    }
  }

  const onChange = (e)=>{
    setUpdate({...update,[e.target.name]:e.target.value})
  }

  const updateTeacherProfile = async()=>{
    const {name,bio,location,chargesPerHour,phoneNumber} = update;
    const teacherId = localStorage.getItem('teacherid');
    const URL = `http://localhost:4000/api/teachers/teacher/editprofile/${teacherId}`;
    const response = await fetch(URL,{
      method:"PUT",
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        bio,
        location,
        chargesPerHour,
        phoneNumber
      }),
    })
    const data = response.json();
    console.log(data);
    await getTeacher();
  }

  const updateStudentProfile = async()=>{
    try {
      const {name,location,phoneNumber} = update;
      const studentId = localStorage.getItem('studentid');
      const URL = `http://localhost:4000/api/students/update/${studentId}`;
      const response = await fetch(URL,{
        method:"PUT",
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          location,
          phoneNumber
        }),
      })
      const data = response.json();
      console.log(data);
      await getUser();
    } catch (error) {
      console.log("error", error)
    }
  }


  const getUser = async () => {
    const studentid = localStorage.getItem('studentid');
    if (!studentid) return;
    const URL = `http://localhost:4000/api/students/${studentid}`;
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoggedIn && localStorage.getItem('studentid')) {
      getUser();
    } else if (isLoggedIn && localStorage.getItem('teacherid')) {
      getTeacher();
    } else {
      setUser({});
    }
  }, [isLoggedIn]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <img src={logo} alt="Logo" width="30" height="24" className="d-inline-block align-text-top" />
          <Link className="navbar-brand" to="/">tutorConnect</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {!localStorage.getItem('token') &&
                <li className="nav-item">
                  <Link type="button" class="btn btn-outline-dark" aria-current="page" to="/"><i class="fa-solid fa-house mx-1"></i>Home</Link>
                </li>
              }
            </ul>
            {!isLoggedIn ? (
              <div>
                <Link to='/choose' className="btn btn-outline-primary mx-2"><i class="fa-solid fa-user-plus mx-2"></i>Sign up</Link>
                <Link to='/login' className="btn btn-outline-primary mx-2"> <i class="fa-solid fa-right-to-bracket mx-2"></i>Login</Link>
              </div>
            ) : (
              <div className='d-flex justify-content-center align-items-center'>
                <button className="btn btn-outline-primary mx-2" onClick={handleLogout}><i class="fa-solid fa-right-from-bracket mx-2"></i>Log out</button>
                <i className="fa-solid fa-circle-user fa-2x mx-2" onClick={handleClick} style={{ cursor: "pointer" }}></i>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Offcanvas trigger (hidden) */}
      <button className="btn btn-primary d-none" ref={ref} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
        Open Profile
      </button>

      {/* Modal trigger (hidden) */}
      <button
        type="button"
        className="d-none"
        ref={editref}
        data-bs-toggle="modal"
        data-bs-target="#editexamplemoodle"
      >
        Open Modal
      </button>

      {/* Offcanvas */}
      <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">User Profile</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <img className="img-fluid rounded-circle mb-3" src={image} alt="student" style={{ height: "100px", width: "100px" }} />
          <h5>{user.name}</h5>
          <p className="text-muted">{user.email}</p>
          <p className="text-muted">{user.phoneNumber}</p>
          <p className="text-muted">{user.location}</p>
           <p className='text-muted'>{user.bio}</p>
          <button type="button" className="btn btn-outline-primary" onClick={handleEdit}>
            <i className="fa-solid fa-user-pen mx-2"></i>Edit profile
          </button>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="editexamplemoodle" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className="form-control" id="name" value={update.name || ''} name='name' onChange={onChange} />
                </div>
                {localStorage.getItem('teacherid') && <div className="mb-3">
                  <label htmlFor="bio" className="form-label">Bio</label>
                  <input type="text" className="form-control" id="bio" value={update.bio||''} name='bio' onChange={onChange}/>
                </div>}
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input type="text" className="form-control" id="location" value={update.location||''} name='location' onChange={onChange}/>
                </div>
                {localStorage.getItem('teacherid') && <div className="mb-3">
                  <label htmlFor="chargesPerHour" className="form-label">Charges Per Hour</label>
                  <input type="number" className="form-control" id="chargesPerHour" value={update.chargesPerHour||''} name='chargesPerHour' onChange={onChange}/>
                </div>}
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                  <input type="number" className="form-control" id="phoneNumber" value={update.phoneNumber||''} name='phoneNumber' onChange={onChange}/>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpdate} >Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
