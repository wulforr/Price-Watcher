import React from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.css';

export default function LandingPage() {
  return (
    <div className={style.landingPageWrapper}>
      <div className={style.contentDiv}>
        <h1>Price Watcher</h1>
        <p>
          A tool to help you buy items in your wishlist at the price that you are comfortable with.
          This tool tracks the price of items added on a daily basis and alerts when the item is
          available below the price set by you.
        </p>
        <p className={style.landingNote}>Note: Currently this tool works only for amazon</p>
        <div className={style.landingButtonsDiv}>
          <button className={`${style.landingBtn} btn`}>
            <Link to="/login">Login/Signup</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
