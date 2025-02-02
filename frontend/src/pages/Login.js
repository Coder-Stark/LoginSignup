import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login() {
  const [loginInfo, setloginInfo] = useState({email: '', password: ''});
  const navigate = useNavigate();

  const handleChange = (e)=>{
    const {name, value} = e.target;
    // console.log(name, value);
    const copyloginInfo = {...loginInfo};
    copyloginInfo[name] = value;
    setloginInfo(copyloginInfo);
  }
  // console.log('loginInfo : ', loginInfo)

  const handleLogin = async (e)=>{
    e.preventDefault();
    const {email, password} = loginInfo;
    if(!email || !password){
      return handleError('Email and Password required');
    }
    try{
      // const url = 'http://localhost:8080/auth/login';
      const BASE_URL = "https://loginsignupbackend-dz69.onrender.com";
      const url = `${BASE_URL}/auth/login`;
      const res = await fetch(url, {
        method: 'POST',
        headers:{
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(loginInfo)
      })
      const result = await res.json();
      const {success, message, error, jwtToken, name} = result;

      if(success){
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      }else if(error){
        const details = error?.details[0].message;       //exact error place
        handleError(details);
      }else if(!success){
        handleError(message);
      }
      // console.log(result);
    }catch(err){
      handleError(err);
    }
  }
  return (
    <div className='container'>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
            <div>
                <label htmlFor='email'>Email</label>
                <input onChange={handleChange} type='email' value={loginInfo.email} name='email' placeholder='Enter Your Email'/>
            </div>
            <div>
                <label htmlFor='password'>Password</label>
                <input onChange={handleChange} type='password' value={loginInfo.password} name='password' placeholder='Enter Your Password'/>
            </div>
            <button>Login</button>
            <span>
                Dont have an account ? <Link to='/signup'>Signup</Link>
            </span>
        </form>
        <ToastContainer />
    </div>
  )
}

export default Login;