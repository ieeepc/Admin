import React, { useState, useEffect } from 'react';
import BASE_URL from '../../service/BaseAddress';

const Login = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchAdmin = async () => {
    let responseData;

    try {
      const response = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      responseData = await response.json();

      if (response.ok) {
        localStorage.setItem('auth-token', responseData.token);
        setLoggedIn(true);
      } else {
        // alert(responseData.message || 'Error logging in');
      }
    } catch (err) {
      console.error('Error during login:', err);
      // alert('An error occurred while logging in.');
    }
  };

  // Redirect to the addproducts page after successful login
  useEffect(() => {
    if (loggedIn) {
      window.location.replace('/');
    }
  }, [loggedIn]); // Redirect when loggedIn state changes

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAdmin();
  };

  return (
    <div className="Login-container">
      <div className="login">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="text-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={changeHandler}
            placeholder="Username"
            required
          />
          <input
            className="text-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
            placeholder="Password"
            required
          />
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
