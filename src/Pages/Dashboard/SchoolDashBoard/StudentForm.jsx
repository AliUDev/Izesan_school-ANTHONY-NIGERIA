import axios from "axios";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { api, storageApi } from "../../../api";
import TextField from "@mui/material/TextField";
import { setLoader } from "../../../redux/Features/Loader/loaderSlice";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import UpdateIcon from "@mui/icons-material/Update";
import { toast } from "react-toastify";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../../redux/Features/LanguagesSlice/languagesSlice";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import ClassesList from "./ClassesList/ClassesList";
import CryptoJS from "crypto-js";
import { Modal, Tooltip } from "@mui/material";
import { encryptedData } from "../../../data.provider";
import PasswordIcon from '@mui/icons-material/Password';
import ImagePopup from "../../../common/ImagePopup";

const StudentForm = (props) => {
  const dispatch = useDispatch();
  const { details } = useSelector((state) => state.languagesDetails);
  const [open, setOpen] = useState(false);
  const [editMode, seteditMode] = useState(false);
  const [code, setcode] = useState("");
  const [link, setlink] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const handleImageClick = (param) => {
    setSelectedImage(param);
    handleOpenPopUp();
  };
 const handleOpenPopUp  = () => setShowPopup(true);
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedImage(null);
  };
  const submitStudent = () => {
    if (code.length > 0 || link.length > 0) {
      dispatch(setLoader(true));
      axios.post(`${api}join-class-new`, {
        class_code: code,
        participants: data.id,
        class_link: link,
      })
        .then((res) => {
          if (res.data.code !== 401) {
      dispatch(setLoader(false));
            toast.info(res.data.message);
          } else {
          dispatch(setLoader(false));

            toast.error(res.data.message);
          }
        }).catch((err) => {
      dispatch(setLoader(false));

          console.log(err)
        })
    } else {
      toast.info("Please Enter Link Or Code");
    }

  }
  const handleOpen = () => {
    setOpen(true);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const data = props?.data;

  const [formData, setformData] = useState({
    id: data.id,
    student_name: data.student_name,
    age: data.age,
    student_image: data.student_image,
    phone_no: data.phone_no,
    language_speak: data.language_speak,
    gender: data.gender,
  });

  const handleFileChange = (event) => {

    setformData({ ...formData, student_image: event.target.files[0] });
  };

  const editData = () => {
    if (formData.age === "") {
      toast.info("Student Age is Required");
    } else if (formData.student_name === "") {
      toast.info("Student Name is Required");
    } else if (formData.student_name.length < 3) {
      toast.info("Student Name Minium Requires 3 Letters");

    }
    else if (formData.gender === "") {
      toast.info("Student Genger is Required");
    } else if (formData.phone_no === "") {
      toast.info("Student Phone Number is Required");
    } else if (formData.age < 3 || formData.age > 99) {
      toast.info("Student Age is Invalid");
    }
    else {
      dispatch(setLoader(true));
      axios
        .post(
          `${api}edit-student`,
          {
            id: data.id,
            student_image: formData.student_image,
            student_name: formData.student_name,
            age: formData.age,
            phone_no: formData.phone_no,
            language_speak: formData.language_speak,
            gender: formData.gender,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
        dispatch(setLoader(false));
          props.liftingState(false);
          toast.success(res.data.message);
        })
        .catch((err) => {
        dispatch(setLoader(false));
          console.log(err);
          toast.error(err.data.message);
        });
    }
  };
  const deletestudent = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const rawData2 = localStorage.getItem("encrypted_data");
        const decryptedData = CryptoJS.AES.decrypt(rawData2, "001").toString(
          CryptoJS.enc.Utf8
        );
        const parsedData = JSON.parse(decryptedData);
        const email = props.data.student_email;
        axios
          .post(`${api}delete-student-school`, {
            student_email: email,
            school_id: parsedData.id,
          })
          .then((res) => {
            props.liftingState(false);
            // toast.success(res.data.message);
            Swal.fire("Deleted!", "Student has been deleted.", "success");
          })
          .catch((err) => {
            console.log(err);
            toast.error(err.data.message);
          });
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age" && value.length <= 2) {
      setformData({ ...formData, [name]: value });

    } else if (name === "phone_no" && value.length <= 15) {
      setformData({ ...formData, [name]: value });

    } else if (name !== "phone_no" && name !== "age") {
      setformData({ ...formData, [name]: value });

    }
  };


  const [editPasswordMode, seteditPasswordMode] = useState(false);

  const [passCodes, setPassCodes] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleChangePassCode = (e) => {
    const { name, value } = e.target;
    setPassCodes({ ...passCodes, [name]: value });
  }

  const editPassword = () => {
    if ((passCodes.password.length < 8) || (passCodes.confirmPassword.length < 8)) {
      toast.info("Password or confirm password should be more than 8")
    } else if (passCodes.password !== passCodes.confirmPassword) {
      toast.info("Password do not match confirm password!")
    } else if(passCodes.password === data.password || passCodes.confirmPassword === data.password){
      toast.error("Your current password can't be new password!")
    }else {
      dispatch(setLoader(true))
      axios.post(`${api}update-student-password`, {
        roll_no: props.data.roll_no,
        school_id: encryptedData().id,
        old_password: data.password,
        password: passCodes.password
      }).then((res) => {
      dispatch(setLoader(false))
        toast.success("Password Updated")
      }).catch((err) => {
      dispatch(setLoader(false))
        toast.error("Something went wrong!")
        console.log(err)
      })

    }
  }

  return (
    <StyledstudentForm className="text-center">
      <div
        className="position-absolute pointer_event"
        onClick={() => props.liftingState(false)}
      >
        <CancelIcon />
      </div>

      <div class="position-absolute top-0 p-4 mt-2 end-0 ">
        {!editMode && <Tooltip title="Change Passcode"><PasswordIcon className='cursor-pointer' onClick={() => seteditPasswordMode(!editPasswordMode)} /></Tooltip>}
        {!editPasswordMode &&
          <span>
            {!editMode && <Tooltip title="Delete Student"><DeleteIcon className='cursor-pointer mx-3 text-danger pointer_event' onClick={() => deletestudent()} /></Tooltip>}
            <Tooltip title="Edit Info"><EditIcon className='cursor-pointer pointer_event text-primary' onClick={() => seteditMode(!editMode)} /></Tooltip>
          </span>
        }
      </div>
      {
        editPasswordMode ? (
          <div className="" style={{paddingTop:"auto", zIndex:"0"}}>
            <h3>Edit Password</h3>
            <div className="d-flex align-items-center justify-content-center editWrapper">
            <div className="row m-0 d-flex align-items-center justify-content-center h-100">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-4">
                <TextField onChange={(e) => handleChangePassCode(e)} sx={{ width: "100%" }} type='text' inputProps={{ maxLength: 50 }} id="filled-basic" label="Enter New Password" value={passCodes.password} name="password" variant="filled" />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-4">
                <TextField onChange={(e) => handleChangePassCode(e)} sx={{ width: "100%" }} id="filled-basic" inputProps={{ maxLength: 50 }} label="Enter Confirm Password" value={passCodes.confirmPassword} name="confirmPassword" variant="filled" />
              </div>
              <Button sx={{ margin: "15px 15px 0 15px" }} size="large" onClick={() => editPassword()} variant="outlined" startIcon={<UpdateIcon />}>
                Update Password
              </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {data?.student_image === formData?.student_image ? (
             <> <img
                width="120px"
                height="120px"
                className="rounded-circle"
                src={`${storageApi}student/${formData.student_image}`}
                onClick={()=>handleImageClick(`${storageApi}student/${formData.student_image}`)}
                alt="..."
              />
              {
                showPopup && 
                <ImagePopup onClose={handleClosePopup} imageUrl={selectedImage} open={handleOpenPopUp}/>
              }</>
            ) : (
              <img
                width="120px"
                height="120px"
                className="rounded-circle"
                src={URL.createObjectURL(formData?.student_image)}
                alt="uploaded"
              />
            )}
            {editMode && (
              <div>
                <label htmlFor="image-upload" className="pointer_event text-primary">
                  Edit
                </label>
                <input
                  type="file"
                  id="image-upload"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>
            )}
            <div className="row m-0">
              <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                <TextField
                  onChange={(e) => handleChange(e)}
                  sx={{ width: "100%" }}
                  id="filled-basic"
                  disabled={!editMode}
                  label="Name"
                  inputProps={{
                    maxLength: 50,
                  }}
                  value={formData.student_name}
                  name="student_name"
                  variant="filled"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                <TextField
                  onChange={(e) => handleChange(e)}
                  sx={{ width: "100%" }}
                  id="filled-basic"
                  label="Email ID"
                  value={data.student_email}
                  disabled
                  variant="filled"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                <TextField
                  onChange={(e) => handleChange(e)}
                  sx={{ width: "100%" }}
                  id="filled-basic"
                  label="Roll No"
                  value={data.roll_no}
                  disabled
                  variant="filled"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                <TextField
                  onChange={(e) => handleChange(e)}
                  sx={{ width: "100%" }}
                  id="filled-basic"
                  disabled={!editMode}
                  type="number"
                  label="Phone Number"
                  value={formData.phone_no}
                  name="phone_no"
                  variant="filled"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                <TextField
                  disabled={!editMode}
                  onChange={(e) => handleChange(e)}
                  sx={{ width: "100%" }}
                  id="filled-basic"
                  type="number"
                  label="Age"
                  inputProps={{
                    inputMode: 'numeric',
                    maxLength: 2
                  }}
                  value={formData.age}
                  name="age"
                  variant="filled"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                <FormControl
                  variant="filled"
                  sx={{ width: "100%" }}
                  disabled={!editMode}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Gender
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={formData.gender}
                    name="gender"
                    sx={{ textAlign: "start" }}
                    onChange={(e) => handleChange(e)}
                    label="Gender"
                    disabled={!editMode}
                  >
                    <MenuItem disabled value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                <FormControl variant="filled" sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Language
                  </InputLabel>
                  <Select
                    disabled={!editMode}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={formData.language_speak}
                    name="language_speak"
                    sx={{ textAlign: "start" }}
                    onChange={(e) => handleChange(e)}
                    label="Language"
                  >
                    <MenuItem disabled value="">
                      <em>None</em>
                    </MenuItem>
                    {details.map((data, index) => (
                      <MenuItem key={index} value={data.language}>
                        {data.language}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                <TextField
                  className="m-1"
                  onChange={(e) => handleChange(e)}
                  sx={{ width: "100%" }}
                  id="filled-basic"
                  disabled={!editMode}
                  label="password"
                  value={data.password}
                  name="password"
                  variant="filled"
                />
              </div>
              {editMode && (
                <Button
                  sx={{ margin: "15px 15px 0 15px" }}
                  size="large"
                  onClick={() => editData()}
                  variant="outlined"
                  startIcon={<UpdateIcon />}
                >
                  Update
                </Button>
              )}
            </div>
            {!editMode && (
              <div>
                <div className="d-flex justify-content-between align-items-center m-1">
                  <h3 className='text-start m-2'>Classes:</h3>
                  <Button variant="outlined" className="m-2" onClick={handleOpen}>
                    Add To Class
                  </Button>
                </div>
                <ClassesList caseType="student" email={data.id} />
              </div>
            )}
          </>
        )
      }

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{zIndex:"0"}}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" color="primary" component="h2">
            Add Student
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              sx={{ width: "100%" }}
              id="filled-basic"
              value={code}
              onChange={(e) => setcode(e.target.value)}
              label="Add By Code"
              name="Code"
              variant="filled"
              onClick
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              sx={{ width: "100%" }}
              onChange={(e) => setlink(e.target.value)}
              value={link}
              id="filled-basic"
              label="Add By Link"
              name="Link"
              variant="filled"
            />
          </Typography>
          <div className="d-flex justify-content-end w-100">
            <Button variant="outlined" className="m-1" onClick={submitStudent}>Add</Button>
            <Button variant="outlined" className="m-1" onClick={handleClose}>Cancel</Button>
          </div>
        </Box>
      </Modal>
    </StyledstudentForm>
  );
};

export default StudentForm;

const StyledstudentForm = styled.div`
  .pointer_event:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
  .wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .editWrapper{
    height: 300px;
    margin: 30px 0;
  }
`;
