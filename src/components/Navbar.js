import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from '../images/defaultStudent.png';
import logo from '../images/tutorConnect-logo.png'

const Navbar = () => {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigator = useNavigate();
  const ref = useRef();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentid');
    setUser({});
    setIsLoggedIn(false);
    navigator('/');
  };

  const handleClick = () => {
    ref.current.click();
  };

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

  // Poll localStorage for token updates every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getUser();
    } else {
      setUser({});
    }
  }, [isLoggedIn]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
        <img src={logo} alt="Logo" width="30" height="24" class="d-inline-block align-text-top"/>
          <Link className="navbar-brand" to="/">tutorConnect</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!localStorage.getItem('token') &&
            
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
          }
          </ul>
            {!isLoggedIn ? (
              <div>
                <Link to='/choose' className="btn btn-outline-primary mx-2">Sign up</Link>
                <Link to='/login' className="btn btn-outline-primary mx-2">Login</Link>
              </div>
            ) : (
              <div>
                <button className="btn btn-outline-primary mx-2" onClick={handleLogout}>Log out</button>
                <i className="fa-solid fa-user mx-3" onClick={handleClick} style={{ cursor: "pointer" }}></i>
              </div>
            )}
          </div>
        </div>
      </nav>

      <button className="btn btn-primary d-none" ref={ref} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
        Enable both scrolling & backdrop
      </button>

      <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">User Profile</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body text-center">
          <img className="img-fluid rounded-circle mb-3" src={image} alt="student" style={{ height: "100px", width: "100px" }} />
          <h5>{user.name}</h5>
          <p className="text-muted">{user.email}</p>
          <p className="text-muted">{user.phoneNumber}</p>
          <p className="text-muted">{user.location}</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
