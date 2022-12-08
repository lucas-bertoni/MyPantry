// All written by Lucas Bertoni

import React, { useState, useEffect } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {

  const [user_id, setUserID] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(0);

  useEffect( () => {
    const auth = async () => {
      const url = process.env.NODE_ENV === 'production'
        ? 'http://localhost:4001/auth' // Change if actually deployed to real web server
        : 'http://localhost:4001/auth';
      
      await axios.post(url, {}, { withCredentials: true })
        .then( (axiosResponse: AxiosResponse) => {
          setUserID(axiosResponse.data.user_id);
          setEmail(axiosResponse.data.email);
          setRole(axiosResponse.data.role);
        })
        .catch( (axiosError: AxiosError) => {
          window.location.href = '/#/login';
        });
    };

    auth();
  }, []);

  if (!email) {
    return (
      <div className='d-flex align-items-center justify-content-center'>
        <p>Unauthorized</p>
      </div>
    )
  } else {
    return (
      <div>
        <div className='d-flex align-items-center justify-content-center'>
          <p>User ID: { user_id }</p>
        </div>
        <div className='d-flex align-items-center justify-content-center'>
          <p>Email: { email }</p>
        </div>
        <div className='d-flex align-items-center justify-content-center'>
          <p>Role: { role }</p>
        </div>
        <div className='d-flex align-items-center justify-content-center'>
          <a className='btn btn-primary' href='/#/logout' role='button'>Logout</a>
        </div>
      </div>
    )
  }
};

export default Home;
