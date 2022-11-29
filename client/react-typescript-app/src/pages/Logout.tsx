// All written by Lucas Bertoni

import React, { useEffect } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

const Logout = () => {

  useEffect(() => {
    const tryLogout = async () => {
      const url = process.env.NODE_ENV === 'production' ?
        'http://localhost:4001/logout': // Change if actually deployed to real web server
        'http://localhost:4001/logout';

      await axios.post(url, {}, { withCredentials: true })
      .then( (axiosResponse: AxiosResponse) => {
        if (axiosResponse.status === 200) {
          window.location.href = '/#/login';
        }
      })
      .catch( (axiosErrorT: AxiosError) => {
        console.log('There was an error logging out');
      });
    }

    tryLogout();
  } , []);

  return null;

}

export default Logout;