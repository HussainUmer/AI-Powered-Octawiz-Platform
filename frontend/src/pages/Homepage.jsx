import React from "react";

import Navbar from "../components/navbar";
import Footer from "../components/footer"; // Import Footer component

import image1 from "../assets/image1.svg"; // Adjust the path as necessary


export default function Homepage() {


    const handleRedirect = () => {
        window.location.href = '/signin'; // Redirect to sign-in page
    };


    return (
        <div className="homepage">
            <Navbar />

            {/* Home Section */}
            <div className="home-section">
                    <div className="home-page-container bg-light py-5">
                        <div className="container">
                            <div className="row align-items-center">
                            {/* Left Column */}
                            <div className="col-md-5 text-left">
                                <h1 className="main-heading">Turning Ideas Into Companies, Fast!</h1>
                                <p className="sub-heading">
                                Turn your ideas into thriving companies using powerful, AI-driven tools for seamless incorporation in UAE, KSA, US, and Singapore.
                                </p>
                                <button className="btn btn-primary btn-lg mt-4" onClick={handleRedirect}>
                                    Let’s Get Started
                                </button>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-7">
                                <img src={image1} alt="Illustration of business growth" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* footer */}
            <Footer />
        </div>
    );
}