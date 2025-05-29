import React, { useEffect, useState, useRef } from 'react';
import image from '../images/defaultStudent.png';
import './Teacherpage.css';
import noBooking from '../images/noboookings.png';
import Footer from './Footer';

const Teacherpage = (props) => {
  const [identity, setIdentity] = useState({});
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [choice, setChoice] = useState(null);
  const [teacherBooking, setTeacherBooking] = useState([]);
  const ref = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const getBookings = async () => {
    const teacherid = localStorage.getItem('teacherid');
    try {
      const URL = `${API_BASE_URL}/api/bookings/teacher/${teacherid}`;
      const response = await fetch(URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (Array.isArray(data.booking)) {
        const sortedBookings = data.booking.sort(
          (a, b) => new Date(b.bookingDateTime) - new Date(a.bookingDateTime)
        );
        setBookings(sortedBookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.log("Error fetching bookings:", error);
    }
  };

  const confirm = async (bookingId) => {
    try {
      const URL = `${API_BASE_URL}/api/bookings/accept/${bookingId}`;
      const response = await fetch(URL, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        props.showAlert(data.message, 'success');
        getBookings();
      }
    } catch (error) {
      console.log("Error confirming booking:", error);
    }
  };

  const reject = async (bookingId) => {
    try {
      const URL = `${API_BASE_URL}/api/bookings/cancel/${bookingId}`;
      const response = await fetch(URL, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        getBookings();
      }
    } catch (error) {
      console.log("Error rejecting booking:", error);
    }
  };

  const getTeacherBooking = async () => {
    try {
      const teacherId = localStorage.getItem('teacherid');
      const URL = `${API_BASE_URL}/api/bookings/getbooking/teacher/${teacherId}`;
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const sortedTeacherBookings = data.bookings.sort(
          (a, b) => new Date(b.bookingDateTime) - new Date(a.bookingDateTime)
        );
        setTeacherBooking(sortedTeacherBookings);
      }
    } catch (error) {
      console.log("Some error occurred: ", error);
    }
  };

  const getTeacher = async () => {
    try {
      const teacherId = localStorage.getItem('teacherid');
      const URL = `${API_BASE_URL}/api/teachers/get/${teacherId}`;
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setIdentity(data.teacher);
    } catch (error) {
      console.log("Some error occurred", error);
    }
  };

  const handleClick = (userChoice, booking) => {
    setSelectedBooking(booking);
    setChoice(userChoice);
    ref.current.click();
  };

  const handleModalConfirm = () => {
    if (choice === "Accept" && selectedBooking) {
      confirm(selectedBooking._id);
    } else if (choice === "Reject" && selectedBooking) {
      reject(selectedBooking._id);
    }
  };

  useEffect(() => {
    getBookings();
    getTeacher();
    getTeacherBooking();
  }, []);

  return (
    <div>
      <div className="content-wrap" style={{ minHeight: "100vh" }}>
        <div className="container">
            <div>
              <h1>Welcome, {identity?.name || "Teacher"}</h1>
              <p className="text-muted fst-italic">"Teaching is the one profession that creates all other professions."</p>
            </div>
          {bookings.length === 0 && (
            <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
              <div className="card border-0" style={{ width: "18rem" }}>
                <img src={noBooking} className="card-img-top" alt="No Bookings" />
              </div>
            </div>
          )}
          <div className="row">
            {teacherBooking.length !==0 && 
              <div className="col-md-4 my-2">
                <div className="card sticky-top" style={{ top: '80px' }}>
                  <div className="card-header">Your Bookings</div>
                  <div className="card-body"  style={{
                    maxHeight: teacherBooking.length > 4 ? '300px' : 'auto',
                    overflowY: teacherBooking.length > 4 ? 'auto' : 'visible',
                  }}>
                    {teacherBooking.length === 0 ? (
                      <p className="card-text">No bookings yet.</p>
                    ) : (
                      teacherBooking.map((booking) => (
                        <div key={booking._id} className="mb-3 p-2 border rounded">
                          <p><strong>Student:</strong> {booking.student?.name || 'N/A'}
                            {booking.status === 'pending' && <span className="badge text-bg-warning mx-1">{booking.status}</span>}
                            {booking.status === 'cancelled' && <span className="badge text-bg-danger mx-1">{booking.status}</span>}
                            {booking.status === 'confirmed' && <span className="badge text-bg-success mx-1">{booking.status}</span>}
                          </p>
                          <p><strong>Date:</strong> {new Date(booking.bookingDateTime).toLocaleDateString()}</p>
                          <p><strong>Time:</strong> {new Date(booking.bookingDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            }

            <div className="col-md-8">
              <div className="row">
                {bookings.map((booking) => (
                  <div className="col-12 col-sm-6 col-lg-6 mb-4 p-3" key={booking._id}>
                    <div className={`card h-100 shadow-sm ${booking.status === 'cancelled' ? 'disabled-card' : ''}`}>
                      <img
                        src={booking.student.studentImage ? booking.student.studentImage:image}
                        className="card-img-top rounded-circle mx-auto d-block mt-3"
                        alt="Student"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{booking.student.name}</h5>
                        <p className="card-text"><strong>Location:</strong> {booking.student.location}</p>
                        <p className="card-text"><strong>Status:</strong> {booking.status}</p>
                        <p className="card-text"><strong>Booking Date:</strong> {booking.bookingDateTime.slice(0, 10)}</p>
                        <div>
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <button
                              type="button"
                              className="btn btn-outline-primary my-2 mx-2"
                              onClick={() => handleClick("Accept", booking)}
                              disabled={booking.status === 'cancelled' || booking.status === 'confirmed'}
                            >
                              {booking.status === 'confirmed' ? "Accepted" : "Accept"}
                            </button>
                          )}
                          {booking.status === 'pending' && (
                            <button
                              type="button"
                              className="btn btn-outline-danger my-2 mx-2"
                              onClick={() => handleClick("Reject", booking)}
                              disabled={booking.status === 'cancelled' || booking.status === 'confirmed'}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="button" className="btn btn-primary d-none" ref={ref} data-bs-toggle="modal" data-bs-target="#exampleModal">
            Launch modal
          </button>
          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Confirmation</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {selectedBooking ? (
                    <div className="row align-items-center">
                      <div className="col-12 col-md-4 text-center mb-3">
                        <img
                          src={image}
                          alt="Student"
                          className="rounded-circle img-fluid"
                          style={{ maxWidth: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="col-12 col-md-8">
                        <h4>Do you want to {choice?.toLowerCase()} the booking for:</h4>
                        <h5 className="mt-2">{selectedBooking.student.name}</h5>
                        <p><strong>Location:</strong> {selectedBooking.student.location}</p>
                        <p><strong>Status:</strong> {selectedBooking.status}</p>
                        <p><strong>Booking Date:</strong> {new Date(selectedBooking.bookingDateTime).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {new Date(selectedBooking.bookingDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ) : (
                    <p>No booking selected</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button
                    type="button"
                    className={`btn ${choice === 'Accept' ? 'btn-primary' : 'btn-danger'}`}
                    data-bs-dismiss="modal"
                    onClick={handleModalConfirm}
                  >
                    {choice === 'Accept' ? 'Confirm' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Teacherpage;
