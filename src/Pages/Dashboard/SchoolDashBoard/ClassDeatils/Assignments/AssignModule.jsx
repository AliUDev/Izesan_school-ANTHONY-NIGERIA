import { Button, Checkbox, FormControl, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react'
import { useDispatch } from "react-redux";

import Stepper1 from '../../../../../common/Stepper1'
import { chaptersList, class_info, dataProvider } from '../../../../../data.provider';
import chapters_img from '../../../../../assets/images/chapters.png'
import styled from '@emotion/styled';
import { api } from '../../../../../api'
import { setLoader } from '../../../../../redux/Features/Loader/loaderSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDate } from '../../../../../Helper/DateProvider';

const AssignModule = ({ close, updateState, closeUpdate }) => {
  const [activeStepper, setactiveStepper] = useState(0);
  const stepperArr = [
    'Select Modules',
    'Give Information',
  ]
  const dispatch = useDispatch();
  const [checkedItems, setCheckedItems] = useState([]);

  const handleCheckboxChange = (event) => {
    const index = parseInt(event);
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter(item => item !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };

  const [form, setform] = useState({
    module_name: 'Module Assignment',
    language: '',
    assigned_by: '',
    class_code: '',
    deadline: '',
    time_limit: '0',
    revision: '0',
    assigned_at: '',
    selected_modules: '',
    notification_status: '',
    attempt_type: '0'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setform(prev => ({ ...prev, [name]: value }))
  }

  const [checkBoxStates, setcheckBoxStates] = useState({
    attempts: false,
    notification_status: false
  });
  const handleformCheckboxChange = (event) => {
    const name = event.target.name;
    const value = event.target.checked;
    setcheckBoxStates((prevState) => ({ ...prevState, [name]: value }));
  };

  const submit = () => {
    const classInfo = class_info();
    const user_info = dataProvider();
    if (form.module_name.length < 1 || form.module_name === '') {
      toast.warn("Please Enter Module Name")
    } else if (form.deadline === "") {
      toast.warn("Deadline is Required")
    } else if (form.time_limit < 1) {
      toast.warn("Invalid Time Limit")
    } else if (form.time_limit === '') {
      toast.warn("Time is Required")
    } else {
      dispatch(setLoader(true))
      axios.post(`${api}add-module-assignment`, {
        module_name: form.module_name,
        language: classInfo.language,
        assigned_by: user_info.teacher_email,
        class_code: classInfo.class_code,
        deadline: formatDate(form.deadline),
        time_limit: form.time_limit,
        revision: form.revision,
        assigned_at: Date.now(),
        selected_modules: checkedItems.toString(),
        notification_status: checkBoxStates.notification_status ? "1" : "0",
        attempt_type: form.attempt_type
      }).then((res) => {
        if (res.data.code === 200) {
          updateState();
          closeUpdate();
          dispatch(setLoader(false))
          toast.info(res.data.message);
          close();
        }
      }).catch((err) => {
        dispatch(setLoader(false))
        toast.warn("Please Enter All Required Data");
        console.log(err)
      })
    }
  }





  return (
    <StyledModuleAssignment>
      {
        activeStepper === 0 &&
        <div className="row">
          <h3 className='mb-3 text-center'>Select Modules</h3>
          {chaptersList.map((data, index) => (
            <div className='col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12  mb-3 px-2 m-0' key={index} onClick={() => handleCheckboxChange(index)} >
              <div className={`row border m-0 rounded option ${checkedItems.includes(index) ? 'bg-success text-light' : ''}`} onClick={() => handleCheckboxChange(index)}>
                <div className='col-5 div_bg' style={{ backgroundImage: `url(${chapters_img})` }}>
                </div>
                <div className='col-7'>
                  <p className="fw-bolder p-0 my-0 pt-2">{data}</p>
                  <p className='p-0 m-0'>Lesson No {index + 1}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
      {
        activeStepper === 1 &&
        <>
         <h3 className='text-center mb-2'>Fill Form</h3>
       
        <div className="row">
          <div className='row m-0'>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
              <TextField
                className='w-100'
                min={new Date()}
                type="date"
                inputProps={{ min: new Date().toISOString().split('T')[0]}}
                id="filled-basic"
                label="Enter Deadline"
                name="deadline"
                variant="filled"
                focused
                value={form.deadline}
                onChange={handleChange}
              />
            </div>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
              <TextField
                className='w-100'
                type="number"
                id="filled-basic"
                label="Enter Time in Minutes"
                name="time_limit"
                variant="filled"
                value={form.time_limit}
                onChange={handleChange}
              />
            </div>
            {/* <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'></div> */}
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
              <Checkbox
                name="attempts"
                checked={checkBoxStates.attempts}
                onChange={handleformCheckboxChange}
              />Attempts
            </div>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
              <Checkbox
                name="notification_status"
                checked={checkBoxStates.notification_status}
                onChange={handleformCheckboxChange}
              />Notification
            </div>

            {
              checkBoxStates.attempts &&
              <>
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                  <FormControl fullWidth>
                    <Select
                      required
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name='attempt_type'
                      onChange={handleChange}
                      value={form.attempt_type}
                      variant="filled"
                      label="Kundengruppe"
                    >
                      <MenuItem value='0'>Per Question</MenuItem>
                      <MenuItem value='1'>Per Module</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                  <TextField
                    className='w-100'
                    type="number"
                    id="filled-basic"
                    label="No of Attempts"
                    name="revision"
                    variant="filled"
                    value={form.revision}
                    onChange={handleChange}
                  />
                </div>
              </>
            }



          </div>
        </div>
        </>
      }
      <div className='text-center row my-4'>
        <div className='col-6' sx={{ innerWidth: "10px" }} ><Button variant='outlined' disabled={activeStepper < 1} onClick={() => setactiveStepper(activeStepper - 1)} >Previous</Button></div>
        {
          activeStepper === 1 ?
            (
              <div className='col-6' sx={{ innerWidth: "10px" }} ><Button onClick={submit} variant='outlined' disabled={form.deadline === ''} >Create Assignment</Button></div>
            ) : (
              <div className='col-6' sx={{ innerWidth: "10px" }} ><Button disabled={checkedItems.length < 1} onClick={() => setactiveStepper(activeStepper + 1)} variant='outlined' >Next</Button></div>
            )
        }
      </div>
      <Stepper1 arr={stepperArr} activeValue={activeStepper} />
    </StyledModuleAssignment>
  )
}

export default AssignModule

const StyledModuleAssignment = styled.div`
.option{
  height: 85px ;
  
}
.option:hover{
  transform: scale(1.01);
  cursor: pointer;
  box-shadow: 0 2px 3px 0px rgb(0 0 0 / 41%);
}
.div_bg {
  background-image: url('path/to/image.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

`