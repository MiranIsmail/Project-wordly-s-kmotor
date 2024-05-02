import "./createAccount.css";
import { useState } from 'react';
import { sha512 } from 'js-sha512';
import usePUT from "../functionalities/usePut";



function CreateAccountPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  
  
  const handleClick = (e) => {
    e.preventDefault();
    
    console.log("Email: ", email, "Password: ", password, "Confirm Password", confirmPassword);
    
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    
    const sha512Password = sha512(password);
    
    console.log("SHA512 Password: ", sha512Password);
    
    // Send the data to the server
    fetch('http://127.0.0.1:8000/createUser/?' + new URLSearchParams({
      email: email, 
      psw: sha512Password, 
      fName: firstName, 
      lName: lastName
    }), {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
    }).then(res => {
      console.log("LOOOOOOOOOOOOOOOOOOOL");
      console.log(res);
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
        alert("Account created successfully");
      }
    }).catch(error => {
      console.error('Error:', error);
    });


  }

  return ( 
    <div className="CreateAccountPage">
      <div className="CreateAccountPage_header">
        <h1>Create Account</h1>
      </div>
      <div className="CreateAccountPage_content">
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

          <label for="confirmPassword">Confirm Password:</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label for="firstName">First Name:</label>
          <input 
            type="text" 
            id="firstName" 
            name="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label for="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <button className="CreateAccountButton">Create Account</button>
        </form>
      </div>
    </div>
   );
}

export default CreateAccountPage;