import "./login.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sha512 } from 'js-sha512';
import { useAuth } from "../auth/authcontext";

function 
LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleClick = (e) => {
    e.preventDefault();
  }

  const handleSubmit = async (e) => {
    const sha512Password = sha512(password);

    console.log("Email: ", email, "Password: ", password);

    fetch('http://127.0.0.1:8000/loginUser/?' + new URLSearchParams({
      email: email, 
      psw: sha512Password, 
    }), {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
    }).then(res => {
      if (!res.ok) {
        throw Error('Could not fetch the data for that resource');
      }
      return res.json();
    }).then(data => {
      console.log(data);
      if (data['success'] === 0) {
        alert(data['message']);
      }
      else {
        // User successfully logged in

        alert(data['message']);
        const token = sha512(sha512Password + email);
        login(token);
      }
    }).catch(error => {
      console.error('Error:', error);
    });
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