import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { api } from '../../../../api';
import TextField from '@mui/material/TextField';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import userLogo from '../../../../assets/images/upload.png'
import ImageCropper from '../../../../common/ImageCropper';
import { toast } from 'react-toastify';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import { fetchData } from '../../../../redux/Features/LanguagesSlice/languagesSlice';
import { setLoader } from '../../../../redux/Features/Loader/loaderSlice';
import Heading from '../../../../common/Heading';
import ValidateEmail from '../../../../Helper/EmailValidator';
import CryptoJS from 'crypto-js';

const AddStudent = () => {
  const dispatch = useDispatch();
  const { details } = useSelector((state) => state.languagesDetails);
  const rawData2 = localStorage.getItem('encrypted_data')
  const decryptedData = CryptoJS.AES.decrypt(rawData2, '001').toString(CryptoJS.enc.Utf8);
  const parsedData = JSON.parse(decryptedData);
  const [image, setimage] = useState(null);
  const [croppedImage, setcroppedImage] = useState(null);
  const id = parsedData.id;
  const getCroppedImg = (param) => {
    setcroppedImage(param);
  };
  useEffect(()=>{

  })
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const [formData, setformData] = useState({
    school_id: '',
    student_name: '',
    student_email: '',
    age: '',
    student_image: '',
    phone_no: '',
    language_speak: '',
    gender: '',
    roll_no: ""
  });

  const handleFileChange = (event) => {
    setimage(URL.createObjectURL(event.target.files[0]));
  };
  const validate = () => {
    if (croppedImage === '') {
      toast.info("Student Image is Required!");
      return false
    } else if (formData.student_name.length < 3) {
      toast.info("Student Name Minimum Requires 3 Letter!");
      return false
    } else if (formData.student_email === '') {
      toast.info("Student Email is Required!");
      return false
    }else if(!ValidateEmail(formData.student_email)){
      toast.info("Please Enter Valid Email!");
      return false
  }
     else if (formData.age === '') {
      toast.info("Student Age Minimum is Required!");
      return false
    } 
    else if (formData.age<3|| formData.age > 99) {
      toast.info("Student Age is invalid!");
      return false
    } else if (formData.phone_no === '') {
      toast.info("Student Phone Number is Required!");
      return false
    }else if (formData.phone_no.length < 13) {
      toast.info("Student Phone Number Minium is Required (13)!");
      return false
    } else if (formData.roll_no === '') {
      toast.info("Add Roll Number for student!");
      return false
    } else if (formData.roll_no.length < 4) {
      toast.info("Roll Number is invalid!");
      return false
    } else if (formData.language_speak === '') {
      toast.info("Please Select Language!");
      return false
    } else if (formData.gender === '') {
      toast.info("Please Choose Gender of the Student!");
      return false
    } else {
      return true
    }
  }

  const addData = () => {


    if (validate()) {
    dispatch(setLoader(true));
      axios.post(`${api}add-student`, {
        school_id: parsedData.id,
        student_image: croppedImage,
        student_name: formData.student_name,
        student_email: formData.student_email,
        age: formData.age,
        phone_no: formData.phone_no,
        language_speak: formData.language_speak,
        gender: formData.gender,
        roll_no: id + '-' + formData.roll_no
      }, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }).then((res) => {
    dispatch(setLoader(false));
        toast.success(res.data.message);
        setcroppedImage(null)
        setformData({
          school_id: '',
          student_name: '',
          student_email: '',
          age: '',
          student_image: '',
          phone_no: '',
          language_speak: '',
          gender: '',
          roll_no: '',
        })
      }).catch((err) => {
    dispatch(setLoader(false));
        console.log(err.response.data);
        toast.error('Invalid Data');

      })
    }
    else {
      // toast.error("Internal Server Error!")
    }


  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age" && value < 100) {
      setformData({ ...formData, [name]: value });
  }  else if (name === "phone_no" && value.length < 16) {
      setformData({ ...formData, [name]: value });
  } else if (name !== 'phone_no' && name !== 'age') {
      setformData({ ...formData, [name]: value });
  } else if (name === "roll_no" && id !== "" && value >4 ){
    setformData({...formData, [name]: value});
  } 
  }
  return (
    <>
     {image &&
                <ImageCropper img={image} getCroppedImg={getCroppedImg}/>}
      <Heading heading="Add Student" />
     
      <StyledAddstudentForm className="text-center mb-5" >
        <div className='row m-0'>
          <div className='col-xl-8 col-lg-8 col-md-8 col-sm-12 col-1 m-0'>
            <div className="bg-mirror rounded-2 p-2 border shadow">

              {
                croppedImage ? (
                  <img width="120px" height="120px" className='rounded-circle border' src={URL.createObjectURL(croppedImage)} alt="..." />
                ) : (
                  <img width="120px" height="120px" className='rounded-circle border' src={userLogo} alt="uploaded" />
                )
              }
              <div>
                <label htmlFor="image-upload" className='edit_btn text-primary'>Add Image</label>
                <input type="file" id="image-upload" onChange={handleFileChange} name="image" accept="image/*" style={{ display: 'none' }} />
               
              </div>
              <div className="row m-0">
                <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                  <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} id="filled-basic" label="Name" value={formData.student_name} name="student_name" variant="filled" />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                  <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} id="filled-basic" label="Email ID" value={formData.student_email} name="student_email" variant="filled" />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                  <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} id="filled-basic" label="Age" type="number" value={formData.age} name="age" variant="filled" />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                  <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} id="filled-basic" label="Phone Number" type="number" value={formData.phone_no} name="phone_no" variant="filled" />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                  <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} id="filled-basic" type='text' label="Roll Number" value={formData.roll_no} name="roll_no" variant="filled" />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                  <FormControl variant="filled" sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={formData.gender}
                      name="gender"
                      sx={{ textAlign: "start" }}
                      onChange={(e) => handleChange(e)}
                      label="Gender"
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
                    <InputLabel id="demo-simple-select-standard-label">Language</InputLabel>
                    <Select
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
                      {
                        details.map((data) => (
                          <MenuItem value={data.language}>{data.language}</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </div>

              </div>
              <Button sx={{ margin: "25px 15px 15px 15px", width: "50%" }} size="large" onClick={() => addData()} variant="outlined" startIcon={<AddIcon />}>
                Add
              </Button>
            </div>

          </div>
          <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 display-sm-none col-12 text-center'>
            <div className="p-3 border bg-mirror shadow rounded-4">
              {
              croppedImage ? (
                  <img width="120px" height="120px" className='rounded-circle border' src={URL.createObjectURL(croppedImage)} alt="..." />
                ) : (
                  <img width="120px" height="120px" className='rounded-circle border' src={userLogo} alt="uploaded" />
                )
              }
              <div className='mt-3'>
                <h4 className='text-truncate'><span className='fw-bolder'></span> <p style={{ maxWidth: "100%" }}>{formData.student_name ? formData.student_name : <p className='text-muted' >Your Name There</p>}</p></h4>
                <div className='row m-0 text-start'>
                  <div className='col-7 mt-3 text-truncate'><span className='fw-bolder'>Email:</span><Tooltip placement="top-start" title={formData.student_email}><p style={{ maxWidth: "100%" }} >{formData.student_email ? formData.student_email : <p className='text-muted text-decoration-underline' >Your Email There</p>}</p></Tooltip></div>
                  <div className='col-5 mt-3 text-truncate'><span className='fw-bolder' >Age:</span> <p style={{ maxWidth: "100%" }}>{formData.age ? formData.age : <p className='text-muted text-decoration-underline' >Your Age There</p>}</p></div>
                  <div className='col-7 mt-3 text-truncate'><span className='fw-bolder' >Phone:</span><Tooltip placement="top-start" title={formData.phone_no}><p style={{ maxWidth: "100%" }}>{formData.phone_no ? formData.phone_no : <p className='text-muted text-decoration-underline' >Your Phone No. There</p>}</p></Tooltip></div>
                  <div className='col-5 mt-3 text-truncate'><span className='fw-bolder' >Roll No:</span><Tooltip placement="top-start" title={formData.roll_no}><p style={{ maxWidth: "100%" }}>{formData.roll_no ? formData.roll_no : <p className='text-muted text-decoration-underline' >Your Roll No. There</p>}</p></Tooltip></div>
                  <div className='col-7 mt-3 text-truncate'><span className='fw-bolder' >Gender: </span><Tooltip placement="top-start" title={formData.gender}><p style={{ maxWidth: "100%" }}>{formData.gender ? formData.gender : <p className='text-muted text-decoration-underline' >Your Gender There</p>}</p></Tooltip></div>
                  <div className='col-5 mt-3 text-truncate'><span className='fw-bolder' >Language:</span><Tooltip placement="top-start" title={formData.language_speak}><p style={{ maxWidth: "100%" }}>{formData.language_speak ? formData.language_speak : <p className='text-muted text-decoration-underline' >Your Language There</p>}</p></Tooltip></div>
                </div>
              </div>

            </div>
          </div>
        </div>


      </StyledAddstudentForm>
    </>
  )
}

export default AddStudent

const StyledAddstudentForm = styled.div`
/* padding: 0 280px ;
@media(max-width: 767px){
    padding: 0 20px ;

} */
z-index: 200;
.edit_btn{
    cursor: pointer;
}
@media(max-width:767px){
    .display-sm-none{
        display: none;
    }
}

`