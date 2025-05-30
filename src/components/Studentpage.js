import React, { useCallback, useEffect, useState } from 'react';
import image from '../images/defaultTeacher.jpg';
import Footer from './Footer';
import noTeacher from '../images/ Noteacher.png';

const BASE_URL = "https://tutorconnect-6.onrender.com"; // <-- change this

const Studentpage = (props) => {
  const [getBooking, setGetBooking] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [user, setUser] = useState({});
  const [bookingDateTime, setBookingDateTime] = useState(
    new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
  );
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const getBookings = useCallback(async () => {
    const studentId = localStorage.getItem('studentid');
    if (!studentId) return;

    try {
      const URL = `${BASE_URL}/api/bookings/getbooking/${studentId}`;
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (Array.isArray(data.booking)) {
        setGetBooking(data.booking);
      } else {
        setGetBooking([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, []);

  const getUser = useCallback(async () => {
    const studentid = localStorage.getItem('studentid');
    if (!studentid) return;

    try {
      const response = await fetch(`${BASE_URL}/api/students/${studentid}`, {
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
  }, []);

  const getTeachers = useCallback(async (studentLocation) => {
    try {
      const response = await fetch(`${BASE_URL}/api/teachers/getTeacherByLocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ location: studentLocation })
      });

      const data = await response.json();
      if (Array.isArray(data.teacher)) {
        setAllTeachers(data.teacher);
      } else {
        setAllTeachers([]);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setAllTeachers([]);
    }
  }, []);

  const handleClick = async (teacherid) => {
    if (!bookingDateTime) {
      props.showAlert("Select Booking Date and Time", "danger");
      return;
    }

    const studentId = localStorage.getItem('studentid');
    if (!studentId) {
      props.showAlert("Student not logged in!", "danger");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/bookings/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId: teacherid,
          studentId: studentId,
          bookingDateTime: bookingDateTime,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        props.showAlert(data.message, 'success');
        getBookings(); // Refresh booking list
      } else {
        props.showAlert(data.message || 'Booking failed', 'danger');
      }
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  useEffect(() => {
    getUser();
    getBookings();
  }, [getUser, getBookings]);

  useEffect(() => {
    if (user.location) {
      getTeachers(user.location);
    }
  }, [user, getTeachers]);

  return (
    <div>
      <div className="content-wrap container mb-4">
        <h1>Welcome {user?.name || 'Student'},</h1>

        {allTeachers.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
            <div className="card border-0" style={{ width: "18rem" }}>
              <img src={noTeacher} className="card-img-top" alt="No Bookings" />
            </div>
          </div>
        ) : (
          <>
            <div className="form-group my-3">
              <label htmlFor="bookingDateTime" className="form-label">Select Class Date & Time:</label>
              <input
                type="datetime-local"
                id="bookingDateTime"
                value={bookingDateTime}
                onChange={(e) => setBookingDateTime(e.target.value)}
                className="form-control rounded-3 p-2 booking-input"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-4 my-2">
                <div className="card sticky-top" style={{ top: '80px' }}>
                  <div className="card-header">Your Bookings</div>
                  <div className="card-body" style={{
                    maxHeight: getBooking.length > 4 ? '300px' : 'auto',
                    overflowY: getBooking.length > 4 ? 'auto' : 'visible',
                  }}>
                    {[...getBooking]
                      .sort((a, b) => new Date(b.bookingDateTime) - new Date(a.bookingDateTime))
                      .map((booking) => (
                        <div key={booking._id} className="mb-3 p-2 border rounded">
                          <p><strong>Teacher:</strong> {booking.teacher?.name || 'N/A'}
                            {booking.status === 'pending' && <span className="badge text-bg-warning mx-1">{booking.status}</span>}
                            {booking.status === 'cancelled' && <span className="badge text-bg-danger mx-1">{booking.status}</span>}
                            {booking.status === 'confirmed' && <span className="badge text-bg-success mx-1">{booking.status}</span>}
                          </p>
                          <p><strong>Subject:</strong> {booking.teacher?.subject || 'N/A'}</p>
                          <p><strong>Date:</strong> {new Date(booking.bookingDateTime).toLocaleDateString()}</p>
                          <p><strong>Time:</strong> {new Date(booking.bookingDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      ))}

                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <h3>Our Dedicated Tutors:</h3>
                <div className="row">
                  {allTeachers.map((teacher) => (
                    <div className="col-12 col-sm-6 col-md-4 mb-4 p-3" key={teacher._id}>
                      <div className="card h-100 shadow-sm">
                        <img
                          src={teacher.teacherImage || image}
                          className="card-img-top rounded-circle mx-auto d-block mt-3"
                          alt="Teacher"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{teacher.name}</h5>
                          <h6 className="card-subtitle mb-2 text-muted">{teacher.subject}</h6>
                          <p><strong>Fees:</strong> ₹{teacher.chargesPerHour}</p>
                          <p><strong>Location:</strong> {teacher.location}</p>
                          <p><strong>Available:</strong> {teacher.availability}</p>
                          <p>{teacher.bio}</p>
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            onClick={() => setSelectedTeacher(teacher)}
                          >
                            Book Tutor
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Confirmation</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              {selectedTeacher ? (
                <div className="row align-items-center">
                  <div className="col-12 col-md-4 text-center mb-3">
                    <img
                      src={selectedTeacher.teacherImage || image}
                      alt="Teacher"
                      className="rounded-circle img-fluid"
                      style={{ maxWidth: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-12 col-md-8">
                    <h4>Do you want to confirm the booking for:</h4>
                    <h5 className="mt-2">{selectedTeacher.name}</h5>
                    <p><strong>Subject:</strong> {selectedTeacher.subject}</p>
                    <p><strong>Fees:</strong> ₹{selectedTeacher.chargesPerHour}</p>
                    <p><strong>Location:</strong> {selectedTeacher.location}</p>
                    <p><strong>Availability:</strong> {selectedTeacher.availability}</p>
                    <p><strong>Bio:</strong> {selectedTeacher.bio}</p>
                    <p><strong>Booking Date:</strong> {bookingDateTime.slice(0, 10)}</p>
                    <p><strong>Booking Time:</strong> {bookingDateTime.slice(11)}</p>
                  </div>
                </div>
              ) : (
                <p>No teacher selected.</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={() => selectedTeacher && handleClick(selectedTeacher._id)} data-bs-dismiss="modal">Confirm</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Studentpage;
