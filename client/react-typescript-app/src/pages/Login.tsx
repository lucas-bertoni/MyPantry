// All written by Lucas Bertoni

import React, { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  useEffect( () => {
    const checkLoggedIn = async () => {
      const url = process.env.NODE_ENV === 'production'
        ? 'http://localhost:4001/auth' // Change if actually deployed to real web server
        : 'http://localhost:4001/auth';

      await axios.post(url, {}, { withCredentials: true })
        .then( (axiosResponse: AxiosResponse) => {
          if (axiosResponse.status === 200) {
            alert('You are already signed in');
            window.location.href = '/#/home';
          }
        })
        .catch( (axiosError: AxiosError) => {
          return;
        });
    };

    checkLoggedIn();
  }, []);

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const onSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    if (email === '' || email === null) {
      alert('Please enter your email');
    } else if (password === '' || password === null) {
      alert('Please enter your password');
    } else {
      const data: { email: string; password: string} = { email, password };

      await axios.post('http://localhost:4001/login', data, { withCredentials: true })
        .then( (axiosResponse: AxiosResponse) => {
          if (axiosResponse.status === 200) {
            window.location.href = '/#/home';
          }
        })
        .catch( (axiosError: AxiosError) => {
          if (axiosError.response?.status === 400) {
            alert('User with that email doesn\'t exist');
            window.location.reload();
          } else if (axiosError.response?.status === 401) {
            alert('Incorrect or invalid login information');
            window.location.reload();
          } else if (axiosError.response?.status === 500) {
            alert('Something went wrong on our end');
            window.location.reload();
          }
        });

      setEmail('');
      setPassword('');
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
            <a className="nav-link active" id="tab-login" data-mdb-toggle="pill" href="javascript:void(0)" role="tab"
              aria-controls="pills-login" aria-selected="true">Login</a>
          </li>
          <li className="nav-item" role="presentation">
            <a className="nav-link" id="tab-register" data-mdb-toggle="pill" href="/#/register" role="tab"
              aria-controls="pills-register" aria-selected="false">Register</a>
          </li>
        </ul>

        <div className="tab-content mt-5">
          <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
            <form onSubmit={ onSubmit }>
              <div className="form-outline mb-4">
                <input type="email" id="current-email" className="form-control" autoComplete="current-email" onChange={(e) => {setEmail(e.target.value)}}/>
                <label className="form-label" htmlFor="loginName">Email</label>
              </div>

              <div className="form-outline mb-4">
                <input type="password" id="current-password" className="form-control" autoComplete="current-password" onChange={(e) => {setPassword(e.target.value)}}/>
                <label className="form-label" htmlFor="loginPassword">Password</label>
              </div>

              <div className="row mb-4">
                <div className="d-flex justify-content-center">
                  <a href="#">Forgot password?</a>
                </div>
              </div>

              <button className="btn btn-primary btn-block mb-4 w-100" >Sign in</button>

              <div className="text-center">
                <p>Not a member? <a href="/#/register">Register</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;