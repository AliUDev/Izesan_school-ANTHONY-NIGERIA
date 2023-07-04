import React, { useEffect, useRef, useState } from 'react'
import '../Login.css'
import TextField from '@mui/material/TextField';
import school_icon from '../../../../assets/images/school_gray.png'
import password_icon from '../../../../assets/images/password_icon_gray.png'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../../../api'
import axios from 'axios'
import Loader1 from '../../../../common/Loader1/Loader1';
import Heading from '../../../../common/Heading';
import CryptoJS from 'crypto-js';

const SchoolLogin = () => {
  const navigate = useNavigate()
  
  const [loading, setloading] = useState(false);
  const [accessCodeInput, setaccessCodeInput] = useState("");
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Perform login action here
      login();
    }
  };
  const code_ref = useRef();

  const login = () => {
    localStorage.clear();
    if (accessCodeInput.length >= 6) {
      setloading(true);
      axios.post(`${api}school-login`, {
        access_code: accessCodeInput
      }).then((res) => {
        if (res.data.code === 200) {
          toast.success(res.data.message);
          const data = JSON.stringify(res.data.data)
          const encryptedData = CryptoJS.AES.encrypt(data, '001').toString();
          localStorage.setItem('encrypted_data', encryptedData);
          navigate('/school-dashboard');
        } else {
          toast.error(res.data.message);
        }
        setloading(false);
      }).catch((err) => {
        navigator.vibrate(1000);
        console.log(err);
        setloading(false);
      })
    } else {
      toast.info('Please Enter Full Access Code')
      code_ref.current.focus();
      setloading(false);

    }
  };

  useEffect(() => {
    if (localStorage.getItem("encrypted_data")) {
      navigate('/school-dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])






  return (
    <div>
      {loading &&
        <Loader1 />
      }
      <Heading heading="School Login" url="/" />
      <div className='position-absolute top-50 start-50 translate-middle login_parent_row text-center'>
        <div className='login_inputs_columns'>
          <TextField
            sx={{
              borderRadius: '30px 30px 0 0',
              '& .MuiFilledInput-root': {
                borderRadius: '30px 30px 0 0',
              },


            }}
            inputProps={{
              style: { height: "40px", boxShadow: "0 1px 2px rgb(0,0,0,0.2)", paddingTop: "34px", borderRadius: '30px 30px 0 0' },
            }}
            disabled
            onKeyPress={handleKeyPress}
            className='loginform_input'
            InputLabelProps={{ style: { marginTop: "12px" } }}
            label={
              <span>
                <img src={school_icon} alt="School Icon" />
                <span style={{ marginLeft: "14px" }}>Registered School</span>
              </span>
            }
            variant="filled"
          />
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                paddingLeft: '50px', // add 30px of padding to the left of the input text
                paddingTop: '45px', // add 10px of padding to the top of the input text
                paddingBottom: '10px', // add 10px of padding to the bottom of the input text
              },
              borderRadius: ' 0 0 30px 30px',
              '& .MuiFilledInput-root': {
                borderRadius: '0 0 30px 30px',
              },
              "& .MuiFilledInput-underline::before": {
                borderBottomColor: "transparent",
                width: "90%",
                marginLeft: "5%"
              },
              "& .MuiFilledInput-underline::after": {
                borderBottomColor: "var(--color1)",
                width: "90%",
                marginLeft: "5%"
              },
            }}
            autoFocus
            inputRef={code_ref}
            inputProps={{
              style: { height: "40px", backgroundColor: "rgb(255,255,255,0.7)", boxShadow: "0 1px 2px rgb(0,0,0,0.2)", paddingTop: "34px", borderRadius: ' 0 0 30px 30px' },
            }}
            onKeyPress={handleKeyPress}
            InputProps={{
              inputProps: {
                maxLength: 6,
              },
              style:{
                height:"78px"
              }
            }}
            className='loginform_input'
            InputLabelProps={{ style: { marginTop: "12px" } }}
            label={
              <span className='mt-4'>
                <img src={password_icon} className='mx-2' alt="Password Icon" />
                <span style={{ marginLeft: "9px" }}>Enter Access Code</span>
              </span>
            }
            required
            variant="filled"
            value={accessCodeInput}
            onChange={(e) => setaccessCodeInput(e.target.value)} />
          <div className='text-end m-auto mt-3 forgot_password_style'>
            <Link className='text-warning text-decoration-none mx-1' to='/forgot-password'>Forgot Password?</Link>
          </div>
          <button 
          // disabled={accessCodeInput.length < 6} 
          className='btn btn-success btn-lg rounded-4 py-3 text-light m-auto mt-4 mb-3 login_button' onClick={() => login()}>Login</button>
          <br />
          <Link to='/register-school' className='text-dark create_new_school_link' >Create a New School</Link>
        </div>
      </div>
    </div>
  )
}

export default SchoolLogin
