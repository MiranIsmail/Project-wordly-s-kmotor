import "./login.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function 
LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
  }

  const handleSubmit = (e) => {
    console.log("Email: ", email, "Password: ", password);
  }

  const handleSignup = () => {
    navigate("/createAccount");
    console.log("Sign up");
  }

  return ( 
    <div className="loginPage">
      <div className="loginPage_header">
        <h1>Login</h1>
      </div>
      <div className="loginPage_content">
        {/* Form for filling in credentials */}
        <form onSubmit={handleClick}>
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button onClick={handleSubmit} className="LoginButton">Login</button>
          <p>Don't have an account?</p>
          <button
            className="signupButton"
            onClick={handleSignup}
          >
          Sign up
          </button>
        </form>
      </div>
    </div>
   );
}

export default LoginPage;