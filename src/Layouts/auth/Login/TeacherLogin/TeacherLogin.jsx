import React, { useState, useRef, useEffect } from 'react'
import '../Login.css'
import TextField from '@mui/material/TextField';
import Loader1 from '../../../../common/Loader1/Loader1';
import school_icon from '../../../../assets/images/school_gray.png'
import password_icon from '../../../../assets/images/password_icon_gray.png'
import { api } from '../../../../api';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from '../../../../common/Heading';
import CryptoJS from 'crypto-js';


const TeacherLogin = () => {
  const navigate = useNavigate()
  const email_ref = useRef(null);
  const accessCode_ref = useRef(null);
  const [loading, setloading] = useState(false);
  const [state, setstate] = useState({
    teacher_email: '',
    teacher_access_code: ''
  });

  useEffect(()=>{
    if(localStorage.getItem("encrypted_data_ts") ){
      navigate('/dashboard');
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[navigate])
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Perform login action here
      submit();
    }
  };
  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setstate((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const validate = (state) => {
    if (state.teacher_email < 1) {
      email_ref.current.focus();
      toast.info("Please Enter Your Email!");
      return false;
    } else if (state.teacher_access_code < 1) {
      accessCode_ref.current.focus();
      toast.info("Please Enter Access Code!")
      return false;
    } else {
      return true;
    }
  }

  const submit = () => {
    localStorage.clear();
    setloading(true);
    if (validate(state)) {
      axios.post(`${api}teacher-login`, state)
        .then((res) => {
          if (res.data.code === 200) {
            toast.success(res.data.message);
            setstate({
              teacher_email: '',
              teacher_access_code: ''
            })
            const data = res.data.data;
            const stringData = JSON.stringify(data);
            const key = "001";
            const encryptedData = CryptoJS.AES.encrypt(stringData, key).toString();
            localStorage.setItem('encrypted_data_ts', encryptedData);
            const participantType = 'teacher';
            const encryptedParticipantType = CryptoJS.AES.encrypt(participantType, key).toString();
            localStorage.setItem('participant_type', encryptedParticipantType);
            navigate('/dashboard');
          } else {
            toast.error(res.data.message)
          }
          setloading(false)
        }).catch((err) => {
          navigator.vibrate(1000);
          console.log(err);
          setloading(false)
        })
    }
  }
  return (
    <div>
      {loading &&
        <Loader1 />
      }
      <Heading heading="Teacher Login" url="/" />
      <div className='position-absolute top-50 start-50 translate-middle login_parent_row text-center'>
        <div className='login_inputs_columns'>
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                paddingLeft: '48px', // add 30px of padding to the left of the input text
                paddingTop: '45px', // add 10px of padding to the top of the input text
                paddingBottom: '10px', // add 10px of padding to the bottom of the input text
              },
              borderRadius: '30px 30px 0 0',
              '& .MuiFilledInput-root': {
                borderRadius: '30px 30px 0 0',
              },
              "& .MuiFilledInput-underline::before": {
                borderBottomColor: "transparent",
              },
              "& .MuiFilledInput-underline::after": {
                borderBottomColor: "var(--color1)",
              }

            }}
            autoFocus
            onKeyDown={handleKeyPress}
            inputRef={email_ref}
            inputProps={{
              style: { height: "40px", backgroundColor: "rgb(255,255,255,0.7)", boxShadow: "0 1px 2px rgb(0,0,0,0.2)", paddingTop: "34px", borderRadius: ' 30px 30px 0 0' },
            }}
            value={state.teacher_email} name="teacher_email"
            onChange={handleInput}
            InputLabelProps={{ style: { marginTop: "12px" } }}
            className='loginform_input'
            label={
              <span>
                <img src={school_icon} alt="School Icon" />
                <span style={{ marginLeft: "14px" }}>Enter Email Address</span>
              </span>
            }
            variant="filled"
          />
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                paddingLeft: '42px', // add 30px of padding to the left of the input text
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
              }

            }}
            inputRef={accessCode_ref}
            inputProps={{
              style: { height: "40px", backgroundColor: "rgb(255,255,255,0.7)", boxShadow: "0 1px 2px rgb(0,0,0,0.2)", paddingTop: "34px", borderRadius: '0 0 30px 30px' },
            }}
            InputProps={{
              inputProps: {
                maxLength: 6,
              },
              style:{
                height:"78px"
              }
            }}
            className='loginform_input'
            onKeyDown={handleKeyPress}

            type="password" value={state.teacher_access_code} name="teacher_access_code" onChange={handleInput}
            InputLabelProps={{ style: { marginTop: "12px" } }}
            label={
              <span className='mt-4'>
                <img src={password_icon} alt="Password Icon" />
                <span style={{ marginLeft: "14px" }}>Enter Access Code</span>
              </span>
            }
            required
            variant="filled"
          />
          <div className='text-end m-auto mt-3 forgot_password_style'>
          </div>
          <button disabled={state.teacher_email.length < 13 || state.teacher_access_code.length < 6} className='btn btn-success btn-lg rounded-4 py-3 text-light m-auto mt-4 mb-3 login_button' onClick={() => submit()}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default TeacherLogin






