import React, { useState } from "react";
import "../assets/styles/footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
    const [email, setEmail] = useState("");

    const handleEmail = (e)=> { 
            setEmail(e.target.value)
    }


    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log(email)

    }
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-about">
          <h2>PropertyHub</h2>
          <p>
            Your trusted partner in real estate. Helping you find your dream
            home or sell your property with ease.
          </p>
          <div className="social-media">
            <a
              href="https://facebook.com/PropertyHub"
              aria-label="Facebook"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#ecf0f1"
                viewBox="0 0 24 24"
              >
                <path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .732.592 1.324 1.325 1.324h11.494v-9.294h-3.124v-3.622h3.124v-2.671c0-3.1 1.894-4.787 4.659-4.787 1.325 0 2.462.099 2.793.143v3.24l-1.917.001c-1.504 0-1.795.715-1.795 1.764v2.31h3.587l-.467 3.622h-3.12v9.294h6.116c.732 0 1.324-.592 1.324-1.324v-21.35c0-.733-.592-1.325-1.325-1.325z" />
              </svg>
            </a>
            <a
              href="https://twitter.com/PropertyHub"
              aria-label="Twitter"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#ecf0f1"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.83.656-2.825.775 1.014-.608 1.794-1.57 2.163-2.723-.949.564-2.003.974-3.127 1.195-.896-.954-2.173-1.55-3.591-1.55-2.717 0-4.917 2.201-4.917 4.917 0 .386.043.762.127 1.124-4.083-.205-7.702-2.159-10.125-5.134-.423.724-.666 1.561-.666 2.457 0 1.694.863 3.188 2.175 4.065-.801-.025-1.555-.245-2.212-.612v.061c0 2.367 1.683 4.342 3.918 4.789-.41.111-.841.171-1.287.171-.314 0-.621-.031-.921-.087.623 1.947 2.432 3.362 4.576 3.402-1.675 1.313-3.785 2.096-6.076 2.096-.395 0-.786-.023-1.17-.068 2.165 1.389 4.736 2.2 7.504 2.2 9.005 0 13.92-7.461 13.92-13.92 0-.212-.005-.425-.014-.637.954-.688 1.786-1.548 2.443-2.532z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/PropertyHub"
              aria-label="Instagram"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#ecf0f1"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.333 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.265.069 1.645.069 4.849s-.012 3.584-.07 4.849c-.062 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.265.058-1.645.069-4.849.069s-3.584-.012-4.849-.07c-1.366-.062-2.633-.333-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608-.058-1.265-.069-1.645-.069-4.849s.012-3.584.07-4.849c.062-1.366.333-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308 1.265-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-1.702.076-3.23.487-4.388 1.646-1.158 1.158-1.569 2.686-1.646 4.388-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.076 1.702.487 3.23 1.646 4.388 1.158 1.158 2.686 1.569 4.388 1.646 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.702-.076 3.23-.487 4.388-1.646 1.158-1.158 1.569-2.686 1.646-4.388.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.076-1.702-.487-3.23-1.646-4.388-1.158-1.158-2.686-1.569-4.388-1.646-1.28-.058-1.688-.072-4.947-.072z" />
                <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm6.406-11.845c-.796 0-1.443.647-1.443 1.443s.647 1.443 1.443 1.443 1.443-.647 1.443-1.443-.647-1.443-1.443-1.443z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h3>Subscribe to our Newsletter</h3>
          <form>
            <input type="email" placeholder="Enter your email" onChange={handleEmail}/>
            <button type="submit" onClick={handleSubmit}>Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PropertyHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
