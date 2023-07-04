import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import EmailValidator from "../../../../Helper/EmailValidator";
import '../Login.css'
function ForgetPassword() {

  const [email, setemail] = useState("")
  const submit = () => {
    if (email === "") {
      toast.error("Email Address is Required")
    } else if (!EmailValidator(email)) {
      toast.error("Invalid Email")
      return false
    } else {
      /////api intregration
    }
  }
  return (
    <Wrapper>
      <div className='position-absolute top-50 start-50 translate-middle text-center bg-mirror px-2 border wrapper_parent rounded'>
        <div className='login_inputs_columns'>
          <h3 className='fw-bold'>Forgot Password?</h3>
          <p>Please Enter Your Account Email Address we will get back to you with the reset password link and confirmation OTP</p>
          <p className="loginPara">Add your email address there:</p>
          <input
            type="email"
            placeholder="Email"
            name='email'
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="p-3 w-75 rounded-pill border loginInput"
          />
          <button
            onClick={submit}
            className="btn-primary button p-3 w-75 text-light rounded-pill mt-4 fw-bold">
            Send
          </button>

          <p className="loginPara text-dark mt-4 ">
            Click here to
            <Link className='mx-2' to="/school-login" >
              Login
            </Link>
          </p>
        </div>
      </div>
    </Wrapper>
  )
}
const Wrapper = styled.div`

.button{
  background-color: green;
  border: none;
}
  @media(max-width: 768px){
    .wrapper_parent{
      width: 75%;;
    } 
  }
  @media(max-width: 425px){
    .wrapper_parent{
      width: 95%;;
    } 
  }

`
export default ForgetPassword