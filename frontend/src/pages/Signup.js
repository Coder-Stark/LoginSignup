import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
function Signup() {
  const [signupInfo, setsignupInfo] = useState({name: '', email: '', password: ''});
  const navigate = useNavigate();

  const handleChange = (e)=>{
    const {name, value} = e.target;
    console.log(name, value);
    const copysignupInfo = {...signupInfo};
    copysignupInfo[name] = value;
    setsignupInfo(copysignupInfo);
  }
  console.log('signupInfo : ', signupInfo)

  const handleSignup = async (e)=>{
    e.preventDefault();
    const {name, email, password} = signupInfo;
    if(!name || !email || !password){
      return handleError('name, email and Password required');
    }
    try{
      const url = 'http://localhost:8080/auth/signup';
      const res = await fetch(url, {
        method: 'POST',
        headers:{
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(signupInfo)
      })
      const result = await res.json();
      const {success, message, error} = result;

      if(success){
        handleSuccess(message);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }else if(error){
        const details = error?.details[0].message;       //exact error place
        handleError(details);
      }else if(!success){
        handleError(message);
      }
      console.log(result);
    }catch(err){
      handleError(err);
    }
  }
  return (
    <div className='container'>
        <h1>Signup</h1>
        <form onSubmit={handleSignup}>
            <div>
                <label htmlFor='name'>Name</label>
                <input onChange={handleChange} type='text' value={signupInfo.name} name='name' autoFocus placeholder='Enter Your Name'/>
            </div>
            <div>
                <label htmlFor='email'>Email</label>
                <input onChange={handleChange} type='email' value={signupInfo.email} name='email' placeholder='Enter Your Email'/>
            </div>
            <div>
                <label htmlFor='password'>Password</label>
                <input onChange={handleChange} type='password' value={signupInfo.password} name='password' placeholder='Enter Your Password'/>
            </div>
            <button>Signup</button>
            <span>
                Already have an account ? <Link to='/login'>Login</Link>
            </span>
        </form>
        <ToastContainer />
    </div>
  )
}

export default Signup