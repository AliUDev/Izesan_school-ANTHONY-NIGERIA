import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Close } from '@mui/icons-material';
import { setLoader } from '../redux/Features/Loader/loaderSlice';
import styled from '@emotion/styled';
import { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { class_info, dataProvider, encryptedData } from '../data.provider';
import chapters_img from '../assets/images/chapters.png'
import { Checkbox, FormControl, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { api } from '../api';
import { toast } from 'react-toastify'
import { getAssignmentQuiz } from '../redux/Features/AssignmentQuizSlice/AssignmentQuizSlice';
import { useDispatch } from 'react-redux';

const steps = [
    'Select Questions',
    'Add Details',
];
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '98vh',
    width: "98%",
    overflow: "scroll",
    bgcolor: 'background.paper',
    border: '1px solid #0000002d',
    boxShadow: 24,
    p: 4,
    borderRadius: '5px'
};
const QuestionModal = ({ openState, openFunction, questions, close, closeUpdate,  module }) => {

    const dispatch = useDispatch();
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    const selectingFunction = (e) => {
        if (!selectedQuestions.includes(e)) {
            setSelectedQuestions((prev) => [...prev, e])
        } else if (selectedQuestions.includes(e)) {
            setSelectedQuestions(selectedQuestions.filter(item => item !== e))
        }
    }

    const [step, setstep] = useState(0);
    const [checkBoxStates, setcheckBoxStates] = useState({
        attempts: false,
        notification_status: false,
        time: false
    });
    const [form, setform] = useState({
        assigned_module_id: 1,
        language: '',
        teacher_id: '',
        module_name: '',
        class_code: '',
        deadline: '',
        time_limit: '0',
        revision: '0',
        selected_questions: '',
        notification_status: '',
        attempt_type: '0'
    });
    const submit = () => {
        if(form.deadline === ""){
            toast.info("Please fill deadline")
        }else if(form.time_limit === ""){
            toast.info("Please fill time")
        }else if(form.time_limit < 1){
            toast.info("Time is Invalid")
        }else if(form.revision < 1){
            toast.info("Revision is Invalid")
        }else if(form.revision === ""){
            toast.info("Please fill revision")
        }else if(form.attempt_type=== ""){
            toast.info("Please select attempt type")
        }
       else {const obj = {
            assigned_module_id: parseInt(module[1]),
            language: class_info().language,
            teacher_id: encryptedData() ? encryptedData().id : dataProvider().school_id,
            module_name: "Quiz Assignment",
            class_code: class_info().class_code,
            deadline: form.deadline,
            time_limit: form.time_limit,
            revision: form.revision,
            selected_questions: selectedQuestions.toString(),
            notification_status: checkBoxStates.notification_status ? 1 : 0,
            attempt_type: form.attempt_type
        }
        dispatch(setLoader(true))
        axios.post(`${api}add-quiz`, obj).then((res) => {
        dispatch(setLoader(false))
            toast.success(res.data.message)
                openFunction(false);
                close();
                closeUpdate();
                dispatch(getAssignmentQuiz({class_code : class_info().class_code}));
        }).catch((err) => {
        dispatch(setLoader(false))
        toast.err("Something went wrong!")

            console.log(err)
        })}
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setform(prev => ({ ...prev, [name]: value }))

    }
    const handleformCheckboxChange = (event) => {
        const name = event.target.name;
        const value = event.target.checked;
        setcheckBoxStates((prevState) => ({ ...prevState, [name]: value }));
    };

    return (
        <Modal
            open={openState}
            onClose={() => openFunction(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{zIndex: "0!important"}}
        >
            <StyledQuestionModal>
                <Box sx={style}>
                    <div className='row'>
                    <div className='col-3'></div>
                    <div className='col-6'><h3 className='my-3 text-center'>Select Questions</h3></div>
                   <div className='col-3 d-flex justify-content-end'>
                    <Close className='cursor-pointer my-4' onClick={() => openFunction(false) + setSelectedQuestions([])} />
                    </div>
                    </div>
                    {
                        step === 0 ? (
                            <>
                                <div style={{ height:'40vh', overflowX:"auto"}}>
                                <div className='d-flex justify-content-center text-center m-0' style={{ flexWrap: 'wrap', 
                           }}>
                                    {
                                        questions.map((data, index) => (
                                            <div key={index} className={`question ${selectedQuestions.includes(index) ? "bg-info" : ''}`} onClick={() => selectingFunction(index)} >
                                                <div>{data.question}</div>
                                            </div>

                                        ))
                                    }
                                </div>
                                </div>
                            </>
                        ) : (
                            <>
                            <div style={{zIndex: "0!important"}}
>
                                <h3 className='my-3'>Add Details</h3>
                                <div className='row m-0'>
                                    <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                        
                                        <TextField variant='filled' inputProps={{ min: new Date().toISOString().split('T')[0]}} label="Deadline" sx={{ width: "100%" }}  onChange={handleChange} name="deadline" value={form.deadline} type="date" focused />
                                    </div>
                                    <div className='col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12 px-3 mb-3'>
                                        <Checkbox
                                            onChange={handleformCheckboxChange}
                                            name="attempts"
                                            checked={checkBoxStates.attempts}
                                        />Attempts
                                    </div>
                                    <div className='col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12 px-3 mb-3'>
                                        <Checkbox
                                            name="time"
                                            checked={checkBoxStates.time}
                                            onChange={handleformCheckboxChange}
                                        />Time
                                    </div>
                                    <div className='col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12 px-3 mb-3'>
                                        <Checkbox
                                            checked={checkBoxStates.notification_status}
                                            onChange={handleformCheckboxChange}
                                            name="notification_status"
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
                                                        inputProps={{maxLength : 4}}
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
                                                    inputProps={{maxLength : 2}}
                                                    name="revision"
                                                    variant="filled"
                                                    value={form.revision}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </>
                                    }
                                    {
                                        checkBoxStates.time &&
                                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                                            <TextField variant='filled' name="time_limit" value={form.time_limit} onChange={handleChange} label="Time" placeholder='Minutes' sx={{ width: "100%" }} type="number" />
                                        </div>
                                    }
                                </div>
                                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-4'>
                                    <div className='row border rounded'>
                                        <div className='col-4 div_bg' style={{ backgroundImage: `url(${chapters_img})` }}>
                                        </div>
                                        <div className='col-8'>
                                            <h4>Selected Module</h4>
                                            <p>{module[0]}</p>
                                            <p>Lesson No. {module[1]}</p>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </>
                        )
                    }
                    <div className='d-flex justify-content-center' style={{zIndex:"0!important"}}>
                        {
                            ["Prev", "Next"].map((data, index) => (
                                <>
                                    {
                                        <Button
                                        disabled={(index === 0 && index === step) || (step === 0 && selectedQuestions.length < 1)}
                                            variant='outlined' sx={{ m: 3 }}
                                            onClick={() => (index && step) !== 1 ? setstep(index) : submit()}
                                        >
                                            {step === 1 && index === 1 ? "Submit" : data}
                                        </Button >
                                    }
                                </>
                            ))
                        }
                    </div>
                    <Stepper activeStep={step} sx={{ mt: 3 }} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </StyledQuestionModal>
        </Modal >

    )
}

export default QuestionModal

const StyledQuestionModal = styled.div`
.question{
    border: 1px solid rgb(0,0,0,0.3);
    padding: 9px;
    margin: 5px;
    cursor: pointer;
    border-radius: 2px;
    font-size: 1.2rem;
}
.css-79ws1d-MuiModal-root {
    position: fixed;
    z-index:0!important;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
}
.stepper{
    width:80%;
}
.div_bg {
  background-image: url('path/to/image.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
    
`