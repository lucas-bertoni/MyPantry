// All written by Lucas Bertoni

import React, { useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ repeatPassword, setRepeatPassword ] = useState('');

  const onSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    if (email === '' || email === null) {
      alert('Please enter your email');
    } else if (password === '' || password === null /* || password.length < 8 */) {
      alert('Your password should be at least 8 characters');
    } else if (password !== repeatPassword) {
      alert('Your passwords don\'t match');
    } else {
      const data: { email: string; password: string } = { email, password };

      const url = process.env.NODE_ENV === 'production' ?
        'http://localhost:4001/register': // Change if actually deployed to real web server
        'http://localhost:4001/register';

      await axios.post(url, data, { withCredentials: true })
        .then( (axiosResponse: AxiosResponse) => {
          if (axiosResponse.status === 201) {
            window.location.href = '/#/home';
          }
        })
        .catch( (axiosError: AxiosError) => {
          if (axiosError.response?.status === 401) {
            alert('User with that email already exists');
            window.location.reload();
          } else if (axiosError.response?.status === 500) {
            alert('Something went wrong on our end');
            window.location.reload();
          }
        });

      setEmail('');
      setPassword('');
      setRepeatPassword('');
    }
  }

  return (
    <div>
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <h1>My Pantry</h1>
        </div>
      </div>
      <div className="container my-5 w-25">
        <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
          <li className="nav-item" role="presentation">
            <a className="nav-link" id="tab-login" data-mdb-toggle="pill" href="/#/login" role="tab"
              aria-controls="pills-login" aria-selected="true">Login</a>
          </li>
          <li className="nav-item" role="presentation">
            <a className="nav-link active" id="tab-register" data-mdb-toggle="pill" href="" role="tab"
              aria-controls="pills-register" aria-selected="false">Register</a>
          </li>
        </ul>
        <form className="mt-5" onSubmit={ onSubmit }>
          <div className="form-outline mb-4">
            <input type="email" id="register-email" className="form-control" onChange={(e) => {setEmail(e.target.value)}}/>
            <label className="form-label" htmlFor="register-email">Email</label>
          </div>

          <div className="form-outline mb-4">
            <input type="password" id="register-password" className="form-control" onChange={(e) => {setPassword(e.target.value)}}/>
            <label className="form-label" htmlFor="register-password">Password</label>
          </div>
      
          <div className="form-outline mb-4">
            <input type="password" id="register-repeat-password" className="form-control" onChange={(e) => {setRepeatPassword(e.target.value)}}/>
            <label className="form-label" htmlFor="register-repeat-password">Repeat password</label>
          </div>

          <button id="register-button" className="btn btn-primary btn-block mb-3 w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;