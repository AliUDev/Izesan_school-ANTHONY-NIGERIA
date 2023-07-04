import React, { useRef, useState, useEffect } from "react";
import "../Login.css";
import TextField from "@mui/material/TextField";
import school_icon from "../../../../assets/images/school_gray.png";
import password_icon from "../../../../assets/images/password_icon_gray.png";
import { toast } from "react-toastify";
import { api } from "../../../../api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Heading from "../../../../common/Heading";
import Loader1 from "../../../../common/Loader1/Loader1";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
const StudentLogin = () => {
  const navigate = useNavigate();
  const rollno_ref = useRef(null);
  const password_ref = useRef(null);
  const [loading, setloading] = useState(false);
  const [state, setstate] = useState({
    roll_no: "64-1",
    password: "12345",
    school_device_id: "",
  });
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
        [name]: value,
      };
    });
  };

  const validate = (state) => {
    if (state.roll_no < 1) {
      rollno_ref.current.focus();
      toast.info("Please Enter Your Roll No.");
      return false;
    } else if (state.password < 1) {
      password_ref.current.focus();
      toast.info("Please Enter Password!");
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (localStorage.getItem("encrypted_data_ts")) {
      navigate("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePassword = (param) => {
    Swal.fire({
      title: "Please update your password",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Update",
      showLoaderOnConfirm: true,
      preConfirm: (newPass) => {
        return axios
          .post(`${api}update-student-password`, {
            roll_no: param.roll_no,
            school_id: param.school_id,
            old_password: param.password,
            password: newPass,
          })
          .then((response) => {
            if (("first", response.data.code !== 200)) {
              throw new Error(response.message);
            }
            return response;
          })
          .catch((error) => {
            navigator.vibrate(1000);
            console.log(error);
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Success", "Password Updated Succssfully");
      }
    });
  };

  const submit = () => {
    localStorage.clear();
    if (validate(state)) {
      setloading(true);
      axios
        .post(`${api}student-login`, state)
        .then((res) => {
          const data = res.data.data;

          if (res.data.code === 200) {
            toast.success(res.data.message);

            if (res.data.data.password === "12345") {
              changePassword(res.data.data);
            }
            setstate({
              roll_no: "",
              password: "",
              school_device_id: "",
            });
            const stringData = JSON.stringify(data);
            const key = "001";
            const encryptedData = CryptoJS.AES.encrypt(
              stringData,
              key
            ).toString();
            localStorage.setItem("encrypted_data_ts", encryptedData);
            const participantType = "student";
            const encryptedParticipantType = CryptoJS.AES.encrypt(
              participantType,
              key
            ).toString();
            localStorage.setItem("participant_type", encryptedParticipantType);
            navigate("/dashboard");
          } else {
            toast.error(res.data.message);
          }
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
    }
  };

  return (
    <div>
      {loading && <Loader1 />}
      <Heading heading="Student Login" url="/" />
      <div className="position-absolute top-50 start-50 translate-middle login_parent_row text-center">
        <div className="login_inputs_columns">
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                paddingLeft: '49px', // add 30px of padding to the left of the input text
                paddingTop: '45px', // add 10px of padding to the top of the input text
                paddingBottom: '10px', // add 10px of padding to the bottom of the input text
              },
              borderRadius: "30px 30px 0 0",
              "& .MuiFilledInput-root": {
                borderRadius: "30px 30px 0 0",
              },
              "& .MuiFilledInput-underline::before": {
                borderBottomColor: "transparent",
              },
              "& .MuiFilledInput-underline::after": {
                borderBottomColor: "var(--color1)",
              },
            }}
            inputRef={rollno_ref}
            autoFocus
            onKeyDown={handleKeyPress}
            inputProps={{
              style: {
                height: "40px",
                backgroundColor: "rgb(255,255,255,0.7)",
                boxShadow: "0 1px 2px rgb(0,0,0,0.2)",
                paddingTop: "34px",
                borderRadius: "30px 30px 0 0",
              },
            }}
            value={state.roll_no}
            name="roll_no"
            onChange={handleInput}
            InputLabelProps={{ style: { marginTop: "12px" } }}
            className="loginform_input"
            label={
              <span>
                <img src={school_icon} alt="School Icon" />
                <span style={{ marginLeft: "14px" }}>Enter Roll Number</span>
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
              borderRadius: " 0 0 30px 30px",
              "& .MuiFilledInput-root": {
                borderRadius: "0 0 30px 30px",
              },
              "& .MuiFilledInput-underline::before": {
                borderBottomColor: "transparent",
                width: "90%",
                marginLeft: "5%",
              },
              "& .MuiFilledInput-underline::after": {
                borderBottomColor: "var(--color1)",
                width: "90%",
                marginLeft: "5%",
              },
            }}
            inputRef={password_ref}
            onKeyDown={handleKeyPress}

            inputProps={{
              style: {
                height: "40px",
                backgroundColor: "rgb(255,255,255,0.7)",
                boxShadow: "0 1px 2px rgb(0,0,0,0.2)",
                paddingTop: "34px",
                borderRadius: " 0 0 30px 30px",
              },
            }}
            className="loginform_input"
            type="password"
            value={state.password}
            name="password"
            onChange={handleInput}
            InputLabelProps={{ style: { marginTop: "12px" } }}
            label={
              <span className="mt-4">
                <img src={password_icon} alt="Password Icon" />
                <span style={{ marginLeft: "14px" }}>Enter Password</span>
              </span>
            }
            required
            variant="filled"
          />
          <div className="text-end m-auto mt-3 forgot_password_style"></div>
          <button
            disabled={state.password.length < 1 || state.roll_no.length < 1}
            className="btn btn-success btn-lg rounded-4 py-3 text-light m-auto mt-4 mb-3 login_button"
            onClick={() => submit()}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
