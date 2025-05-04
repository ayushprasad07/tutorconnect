import React from 'react'
import image from '../images/Image.png'
import search from '../images/Filter.png'
import aval from '../images/availability 2.png'
import learning from '../images/book.png'
import verified from '../images/verifiedTutor.png'
import flexible from '../images/flexibleSheduling.png'
import pricing from '../images/transparentPricing.png'
import support from '../images/support 2.png'
import booking from '../images/becomeTutor.webp'

const Home = () => {
  return (
    <>
    <div className="card text-center my-3" style={{ background: "linear-gradient(to right, white, #e6f6fa 30%, #e6f6fa 70%, white)", border: "none" }}>
      <div className="row g-0">
        <div className="col-md-4 d-flex align-items-center">
          <img src={image} className="img-fluid rounded-start" alt="tutorConnect" />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h1 className="card-title">Find the Perfect</h1>
            <h1>Tutor Near You!</h1>
            <p>
              tutorConnect helps students connect with verified tutors of different subjects in their locality
            </p>
            <div className='my-4'>
              <button type="button" className="btn btn-light">Subject <i className="fa-solid fa-greater-than mx-1"></i></button>
              <button type="button" className="btn btn-light">Location <i className="fa-solid fa-greater-than mx-1"></i></button>
              <button type="button" className="btn btn-dark">Select Tutor</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="card text-center border-0">
        <div className="card-body">
            <h1 className="card-title">How it Works</h1>
            <div className='container my-5'>
                <div className='row justify-content-center'>
                <div className="col-md-4 d-flex justify-content-center mb-4">
                    <div className="card text-center border-0" style={{ width: "18rem" }}>
                        <img src={search} className="card-img-top" alt="..." />
                        <div className="card-body">
                        <h5 className="card-title">Search and filter tutors</h5>
                        <p className="card-text">
                            Search tutors by subject and location.
                        </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 d-flex justify-content-center mb-4">
                    <div className="card text-center border-0" style={{ width: "18rem" }}>
                        <img src={aval} className="card-img-top" alt="..." />
                        <div className="card-body">
                        <h5 className="card-title">Check Availibility and fees</h5>
                        <p className="card-text">
                            View the availability of the tutor and fees per hour.
                        </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 d-flex justify-content-center mb-4">
                    <div className="card text-center border-0" style={{ width: "18rem" }}>
                        <img src={learning} className="card-img-top" alt="..." />
                        <div className="card-body">
                        <h5 className="card-title">Book and Start Learning</h5>
                        <p className="card-text">
                            Schedule lessons, with your choosen tutor.
                        </p>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
    <div className="container text-center py-5">
        <h1 className="mb-5">Why choose tutorConnect?</h1>
        <div className="row g-4">
          {[{ img: verified, title: "Verified Tutors" },
            { img: flexible, title: "Flexible Scheduling" },
            { img: pricing, title: "Transparent Pricing" },
            { img: support, title: "24/7 Support" }
          ].map((item, index) => (
            <div key={index} className="col-6 col-md-3">
              <div className="card border-0 h-100">
                <img src={item.img} className="card-img-top" alt={item.title} />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
    <div className="container py-5" style={{ 
    background: "linear-gradient(to right, white, #e6f6fa 30%, #e6f6fa 70%, white)", 
    border: "none" 
}}>
  <div className="row align-items-center">
    
    {/* Text Section */}
    <div className="col-12 col-md-6 mb-4 mb-md-0">
      <h1 className="mb-3">Become a Tutor on Our Platform</h1>
      <p className="text-muted mb-4">
        Share your knowledge and earn money by joining our network of professional tutors. 
        We handle the marketing and payments — you focus on teaching.
      </p>
      <div className="d-flex flex-column gap-2">
        <p><i className="fa-solid fa-square-check text-success me-2"></i>Set your own hourly rates and availability</p>
        <p><i className="fa-solid fa-square-check text-success me-2"></i>Connect with students in your area</p>
        <p><i className="fa-solid fa-square-check text-success me-2"></i>Build your teaching profile and portfolio</p>
        <p><i className="fa-solid fa-square-check text-success me-2"></i>Receive payments securely from our platform</p>
        <p><i className="fa-solid fa-square-check text-success me-2"></i>Grow your tutoring business with minimal marketing efforts</p>
        <p className="fw-semibold mt-3">
          Only 10% commission on your earnings — among the lowest from other platforms.
        </p>
      </div>
    </div>

    {/* Image Section */}
    <div className="col-12 col-md-6 text-center">
      <img 
        src={booking} 
        alt="booking illustration" 
        style={{ height: "50vh", maxWidth: "100%", objectFit: "cover" }} 
        className="img-fluid"
      />
    </div>

  </div>
</div>

      <div className="footer card text-center border-0" style={{ background: "linear-gradient(to right, white, #e6f6fa 30%, #e6f6fa 70%, white)" }}>
        <div className="card-body">
          <h5 className="card-title">tutorConnect</h5>
          <p className="card-text text-muted">For any query email: ayushprasad2110@gmail.com</p>
        </div>
      </div>
    </>
  )
}

export default Home
