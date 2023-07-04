import React, { useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import school_icon from "../../../assets/images/school_gray.png";
import mobile_icon from "../../../assets/images/mobile_gray.png";
import user_icon from "../../../assets/images/user_gray.png";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Heading from "../../../common/Heading";
import { api } from "../../../api";
import FilterIcon from "@mui/icons-material/Filter";
import Loader1 from "../../../common/Loader1/Loader1";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ValidateEmail from "../../../Helper/EmailValidator";
import ImageCropper from "../../../common/ImageCropper";
import styled from "@emotion/styled";
import { InputAdornment } from "@mui/material";

const RegisterSchool = () => {
  const [loading, setloading] = useState(false);
const navigate = useNavigate();
  const [image, setimage] = useState(null);
  const [croppedImage, setcroppedImage] = useState(null);
  console.log(croppedImage);

  const [data, setdata] = useState({
    email_id: "",
    school_name: "",
    phone: "",
    no_of_members: "",
    school_image: null,
  });
  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;

    if (name === "school_image") {
      // setdata((prevalue) => {
      //   return {
      //     ...prevalue,
      //     [name]: event?.target?.files[0],
      //   };
      // });
      setimage(URL.createObjectURL(event?.target?.files[0]));
      console.log(image, "image")
    } else {
      if (name === "phone" && value.length <= 15) {
        setdata((prevalue) => {
          return {
            ...prevalue,
            [name]: value,
          };
        });
      } else if (name === "no_of_members" && value.length <= 4 && (value > 0 || value !== 0)) {
        setdata((prevalue) => {
          return {
            ...prevalue,
            [name]: value,
          };
        });
      } else if (name !== "phone" && name !== "no_of_members") {
        setdata((prevalue) => {
          return {
            ...prevalue,
            [name]: value,
          };
        });
      }
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Perform login action here
      submit();
    }
  };
  const email_ref = useRef(null);
  const school_ref = useRef(null);
  const phone_ref = useRef(null);
  const member_ref = useRef(null);
  const image_ref = useRef(null);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "6px",
    p: 4,
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {setOpen(false)
  navigate("/school-login")};

  const [apiResponse, setapiResponse] = useState({
    access_code: "",
    email_id: "",
  });

  const validate = (data) => {
    if (!ValidateEmail(data.email_id)) {
      email_ref.current.focus();
      toast.info("Please Enter Valid Email");
      return false;
    } else if (data.school_name.length < 1) {
      school_ref.current.focus();
      toast.info("Please Enter School Name");
      return false;
    } else if (data.phone.length < 13) {
      phone_ref.current.focus();
      toast.info("Please Enter Correct Phone No.");
      return false;
    } else if (data.no_of_members.length < 1) {
      member_ref.current.focus();
      toast.info("Please Enter No. Of Members");
      return false;
    }else if (data.no_of_members < 1) {
      member_ref.current.focus();
      toast.info("Please Enter Valid No. Of Members");
      return false;
    }  else if (croppedImage === null || croppedImage === "") {
      image_ref.current.focus();
      toast.info("Please Select School Image");
      return false;
    } else {
      return true;
    }
  };

  const submit = () => {
    if (validate(data)) {
      setloading(true);

      axios
        .post(
          `${api}request-school-code`,
          {
            email_id: data.email_id,
            school_name: data.school_name,
            phone: data.phone,
            no_of_members: data.no_of_members,
            school_image: croppedImage,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          setdata({
            email_id: "",
            school_name: "",
            phone: "",
            no_of_members: "",
            school_image: null,
          });
          toast.success(res.data.message);
          const resForHook = res.data.data[0];
          setapiResponse({
            access_code: resForHook.access_code,
            email_id: resForHook.email_id,
          });
          handleOpen();
          document.getElementById("file-input").value = "";
         
          setloading(false);
          setcroppedImage(null);
          // navigate("/school-login");
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
    }
  };
  const getCroppedImg = (param) => {
    setcroppedImage(param);
  };

  return (
    <Wrapper>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <p>
                Your registered school information is below, don't share this
                information to someone
              </p>
              <h5>
                Your Email:{" "}
                <span className="text-success">{apiResponse?.email_id}</span>{" "}
              </h5>
              <h5 className="mt-3">
                Access Code:{" "}
                <span className="text-success">{apiResponse?.access_code}</span>
              </h5>
              <div className="text-center">
                <Button
                  variant="outlined"
                  size="large"
                  className="px-5 mt-2"
                  onClick={handleClose}
                >
                  Ok
                </Button>
              </div>
            </Typography>
          </Box>
        </Modal>
        {loading && <Loader1 />}
        <Heading heading="Register School" />
        <div className=" login_parent_row text-center mt-3 m-auto position-absolutes">
          <div className="login_inputs_columns">
            <TextField
              sx={{
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
              autoFocus
              inputRef={email_ref}
              inputProps={{
                style: {
                  height: "40px",
                  backgroundColor: "rgb(255,255,255,0.9)",
                  boxShadow: "0 1px 2px rgb(0,0,0,0.2)",
                  paddingTop: "34px",
                  borderRadius: "30px 30px 0 0",
                },
              }}
              className="loginform_input"
              value={data?.email_id}
              onChange={handleChange}
              type="email"
              name="email_id"
              InputLabelProps={{ style: { marginTop: "12px" } }}
              label={
                <span>
                  <MailOutlineIcon
                    style={{ fontSize: "30px", color: "rgb(0,0,0,0.3)" }}
                  />
                  <span style={{ marginLeft: "14px" }}>Enter Email</span>
                </span>
              }
              variant="filled"
            />
          </div>
          <div className="loginform_input_parent">
            <TextField
              sx={{
                "& .MuiFilledInput-underline::before": {
                  borderBottomColor: "transparent",
                },
                "& .MuiFilledInput-underline::after": {
                  borderBottomColor: "var(--color1)",
                },
              }}
              inputRef={school_ref}
              inputProps={{
                style: {
                  height: "40px",
                  backgroundColor: "rgb(255,255,255,0.9)",
                  boxShadow: "0 1px 2px rgb(0,0,0,0.2)",
                  paddingTop: "34px",
                },
                maxLength: 50,
              }}
              className="loginform_input"
              onKeyDown={handleKeyPress}
              value={data?.school_name}
              onChange={handleChange}
              name="school_name"
              InputLabelProps={{ style: { marginTop: "12px" } }}
              label={
                <span>
                  <img src={school_icon} alt="School Icon" />
                  <span style={{ marginLeft: "14px" }}>Enter School Name</span>
                </span>
              }
              variant="filled"
            />
          </div>
          <div className="loginform_input_parent">
            <TextField
              sx={{
                "& .MuiFilledInput-underline::before": {
                  borderBottomColor: "transparent",
                },
                "& .MuiFilledInput-underline::after": {
                  borderBottomColor: "var(--color1)",
                },
              }}
              
              inputRef={phone_ref}
              inputProps={{
                style: {
                  height: "40px",
                  backgroundColor: "rgb(255,255,255,0.9)",
                  boxShadow: "0 1px 2px rgb(0,0,0,0.2)",
                  paddingTop: "34px",
                },
                inputMode: "numeric",
                min: 0,
              }}
              className="loginform_input"
              onKeyDown={handleKeyPress}
              value={data?.phone}
              type="number"
              onChange={handleChange}
              name="phone"
              InputLabelProps={{ style: { marginTop: "12px" } }}
              label={
                <span>
                  <img src={mobile_icon} className="mx-2" alt="School Icon" />
                  <span style={{ marginLeft: "18px" }}>Enter Phone No.</span>
                </span>
              }
              variant="filled"
            />
          </div>

          <div className="loginform_input_parent">
            <TextField
              sx={{
                "& .MuiFilledInput-underline::before": {
                  borderBottomColor: "transparent",
                },
                "& .MuiFilledInput-underline::after": {
                  borderBottomColor: "var(--color1)",
                },
              }}
              inputRef={member_ref}
              inputProps={{
                style: {
                  height: "40px",
                  backgroundColor: "rgb(255,255,255,0.9)",
                  boxShadow: "0 1px 2px rgb(0,0,0,0.2)",
                  paddingTop: "34px",
                },
                maxLength: 4,
                min: 0,
              }}
              className="loginform_input"
              value={data?.no_of_members}
              type="number"
              onKeyDown={handleKeyPress}
              onChange={handleChange}
              name="no_of_members"
              InputLabelProps={{ style: { marginTop: "12px" } }}
              label={
                <span>
                  <img src={user_icon} className="mx-1" alt="School Icon" />
                  <span style={{ marginLeft: "14px" }}>Enter No. of Members</span>
                </span>
              }
              variant="filled"
            />
          </div>
          <div className="loginform_input_parent">
            <TextField
              focused
              sx={{
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
              inputRef={image_ref}
              label={
                <span className="text-dark text-muted">
                  <FilterIcon />
                  <span style={{ marginLeft: "14px" }}>Your School Logo</span>
                </span>
              }
              inputProps={{
                accept: "image/png",
                style: {
                  height: "40px",
                  backgroundColor: "rgb(255,255,255,0.9)",
                  paddingTop: "34px",
                  borderRadius: " 0 0 30px 30px",
                },
              }}
              InputProps={{
                style: {
                  backgroundColor: "rgb(255,255,255,0.9)",
                  boxShadow: "0 1px 2px rgb(0,0,0,0.2)",
                  borderRadius: " 0 0 30px 30px",
                },

                endAdornment: (
                  <InputAdornment position="end">
                    {
                      croppedImage && <img src={URL.createObjectURL(croppedImage)} style={{ borderRadius: "15px", padding: "2px" }} alt="..." width="80px" height="80px" />
                    }
                  </InputAdornment>
                ),
              }}
              className="loginform_input"
              type="file"
              id="file-input"
              onKeyDown={handleKeyPress}
              accept="image/png"
              name="school_image"
              onChange={handleChange}
              variant="filled"
            />
          </div>
          <div className="">
            {image && (
              <ImageCropper img={image} getCroppedImg={getCroppedImg} />
            )}
          </div>
          <button
            // disabled={data.email_id.length < 13 || data.no_of_members < 1 || data.phone.length < 11 || data.school_image === null || data.school_name.length < 3}
            className="btn btn-success btn-lg rounded-4 py-3 text-light m-auto mt-4 mb-3 px-4"
            onClick={submit}
          >
            Request Registration Code
          </button>
        </div>
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.div`
.MuiFormControl-root.MuiTextField-root.loginform_input.css-562zci-MuiFormControl-root-MuiTextField-root {
    min-width: 60vw!important;
}
.MuiFormControl-root.MuiTextField-root.loginform_input.css-tlkibt-MuiFormControl-root-MuiTextField-root {
    min-width: 60vw!important;
}
.css-1rbkvva-MuiFormControl-root-MuiTextField-root{
    width:60vw;
}
`
export default RegisterSchool;
