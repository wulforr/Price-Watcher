import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

export default function LandingPage() {
  return (
    <div className="landingPageWrapper">
      <div className="contentDiv">
        <h1>Price Watcher</h1>
        <p>
          A tool to help you buy items in your wishlist at the price that you are comfortable with.
        </p>
        <div className="landingButtonsDiv">
          <button className="landingBtn btn">
            <Link to="/login">Login/Signup</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
