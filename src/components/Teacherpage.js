import React, { useEffect, useState, useRef } from 'react';
import image from '../images/defaultStudent.png';
import './Teacherpage.css';
import noBooking from '../images/noboookings.png'
import Footer from './Footer';

const Teacherpage = (props) => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [choice, setChoice] = useState(null); 
  const ref = useRef(null);

  const getBookings = async () => {
    const teacherid = localStorage.getItem('teacherid');
    try {
      const URL = `http://localhost:4000/api/bookings/teacher/${teacherid}`;
      const response = await fetch(URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (Array.isArray(data.booking)) {
        setBookings(data.booking);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.log("Error fetching bookings:", error);
    }
  };

  const confirm = async (bookingId) => {
    try {
      const URL = `http://localhost:4000/api/bookings/accept/${bookingId}`;
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
      const URL = `http://localhost:4000/api/bookings/cancel/${bookingId}`;
      const response = await fetch(URL, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        getBookings();
      }
    } catch (error) {
      console.log("Error rejecting booking:", error);
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
  }, []);

  return (
    <div className="page-container">
      <div className="content-wrap">
        <div className="container">
          <div className="row justify-content-center">
            {bookings.length === 0 && (
              
                <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
                  <div className="card border-0" style={{ width: "18rem" }}>
                    <img src={noBooking} className="card-img-top" alt="No Bookings" />
                  </div>
                  <h5 className="text-muted mt-3">No requests yet.</h5>
                </div>
              )}

            {bookings.map((booking) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 p-3" key={booking._id}>
                <div className={`card h-100 shadow-sm ${booking.status === 'cancelled' ? 'disabled-card' : ''}`}>
                  <img
                    src={image}
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

          <button type="button" className="btn btn-primary d-none" ref={ref} data-bs-toggle="modal" data-bs-target="#exampleModal">
            Launch demo modal
          </button>

          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Confirmation</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {selectedBooking ? (
                    <>
                      <h4>Do you want to {choice?.toLowerCase()} the booking for:</h4>
                      <div className="mt-2">
                        <h5 className="card-title">{selectedBooking.student.name}</h5>
                        <p className="card-text"><strong>Location:</strong> {selectedBooking.student.location}</p>
                        <p className="card-text"><strong>Status:</strong> {selectedBooking.status}</p>
                        <p className="card-text"><strong>Booking Date:</strong> {selectedBooking.bookingDateTime.slice(0, 10)}</p>
                      </div>
                    </>
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
      <Footer/>
    </div>
  );
};

export default Teacherpage;
