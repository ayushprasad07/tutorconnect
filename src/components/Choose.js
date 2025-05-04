import React from 'react'
import student from '../images/studentdp.jpg'
import teacher from '../images/teacher.jpg'
import { Link } from 'react-router-dom'

const Choose = () => {
  return (
    <div>
      <div className="container " >
        <div className="row justify-content-center">
          <div className="card text-center col-md-3 mx-2 my-2 justify-content-center" style={{ width: "18rem" }}>
            <img src={student} className="card-img-top rounded-circle" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Student</h5>
              <Link to="/student" className="btn btn-primary">Sign up</Link>
            </div>
          </div>
          
          <div className="card text-center col-md-3 mx-2 my-2 justify-content-center" style={{ width: "18rem" }}>
            <img src={teacher} className="card-img-top rounded-circle" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Teacher</h5>
              <Link to="/teacher" className="btn btn-primary">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
     </div>
  )
}

export default Choose
