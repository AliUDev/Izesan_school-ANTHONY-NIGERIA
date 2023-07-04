import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api2, img } from '../../api';
import { class_info, dataProvider } from '../../data.provider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import styled from '@emotion/styled';
import ProgressBar from '../../common/ProgressBar';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { typeProvider } from '../../Helper/ParticipantTypeProvider'
import correctAudio from '../../assets/sounds/success.mp3'
import wrongAudio from '../../assets/sounds/fail.mp3'
import wrongAudio2 from '../../assets/sounds/fail2.wav'
import clickAudio from '../../assets/sounds/click.wav'
import completedAudioMp3 from '../../assets/sounds/completed.mp3'
import unSelectAudio from '../../assets/sounds/unselect.wav'
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { getAssignmentProgress } from '../../redux/Features/AssignmentProgressSlice/AssignmentProgressSlice';
import { updateModuleAssignmentProgress } from '../../redux/Features/UpdateAssignmentProgressSlice/UpdateAssignmentProgressSlice';

const AttemptAssignment = () => {
    const { id } = useParams();
    localStorage.setItem("param", id);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [questions, setquestions] = useState([]);
    const [percentageValue, setPercentAgeValue] = useState(0);
    const [questionType, setquestionType] = useState(null);
    const [currentAudio, setcurrentAudio] = useState(null);
    const [randomQuestionArr, setrandomQuestionArr] = useState([]);
    const [answerArr, setanswerArr] = useState([]);
    const [wrongAttempt, setwrongAttempt] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bodyOverflow, setBodyOverflow] = useState('');
    const [rightAnswer, setrightAnswer] = useState(false);
    const [allowWrongIncrement, setallowWrongIncrement] = useState(true);
    const [correctSound] = useState(new Audio(correctAudio));
    const [wrongSound] = useState(new Audio(wrongAudio));
    const [wrongSound2] = useState(new Audio(wrongAudio2));
    const [clickSound] = useState(new Audio(clickAudio));
    const [unselectAudio] = useState(new Audio(unSelectAudio));
    const [completedAudio] = useState(new Audio(completedAudioMp3));
    const [showHintModal, setShowHintModal] = useState(false);
    const [hintText, setHintText] = useState('');

    const [moduleType, setmoduleType] = useState(null);
    const [revisions, setrevisions] = useState(0);
    const [progressRecord, setprogressRecord] = useState({
        right_answer: 0,
        right_answer_arr: [],
        wrong_answer: 0,
        wrong_answer_arr: [],
    });
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
            saveModuleProgress();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    const [counter, setCounter] = useState(null);

    useEffect(() => {
        // Retrieve the counter value from localStorage
        const storedCounter = localStorage.getItem("counter");
        if (storedCounter) {
            setCounter(storedCounter);
        }
    }, []);

    useEffect(() => {
        // Check if the counter has ended
        if (counter === "0:01") {
            completedAudio.play();
            Swal.fire('Attempt Complete', 'The time is over your progress is saved, Good Luck!')
            // Navigate user to the previous page
            setTimeout(() => {
                navigate(-1);
            }, 4000)
        }
    }, [counter]);

    useEffect(() => {
        const onStorageChange = () => {
            const storedCounter = localStorage.getItem("counter");
            if (storedCounter) {
                setCounter(storedCounter);
            }
        };

        window.addEventListener("storage", onStorageChange);

        return () => {
            window.removeEventListener("storage", onStorageChange);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const newCounter = localStorage.getItem('counter') || 0;
            if (newCounter !== counter) {
                setCounter(newCounter);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [counter]);
    function handleCloseHintModal() {
        setIsModalOpen(false);
        document.body.style.overflow = bodyOverflow;
        setShowHintModal(false);
    }

    function HintModal({ hint, onClose }) {
        return (
            <Modal
                open={showHintModal}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {hint}
                    </Typography>
                </Box>
            </Modal>
            //     <div className='hint-container'>
            //   <div className="hint-modal">
            //     <div className="hint-modal-content">
            //       <span className="hint-modal-close position-absolute top-0 end-0 cursor-pointer fs-2" onClick={onClose}>&times;</span>
            //       <p className="fs-5">{hint}</p>
            //     </div>
            //   </div>
            //   </div>
        );
    }
    function HandleHintClick(hint) {
        setShowHintModal(true);
        setHintText(hint);
        setBodyOverflow(document.body.style.overflow);
        document.body.style.overflow = 'hidden';
    }
    const saveModuleProgress = () => {
        const new_local = JSON.parse(localStorage.getItem('assignmentDetails'))
        const assignmentDetails = JSON.parse(localStorage.getItem('assignmentDetails'));
        const localProgressRecord = JSON.parse(localStorage.getItem('progressRecord'));
        const current_question = parseInt(localStorage.getItem('current_question'));
        if (assignmentDetails.type === "quiz") {
            const payload = {
                module_no: id,
                quiz_id: assignmentDetails.module_id,
                language: class_info().language,
                student_id: dataProvider().id,
                progress: (localProgressRecord.right_answer_arr.length / current_question * 100).toFixed(2),
                current_question: current_question,
                right_answer: localProgressRecord.right_answer,
                right_answer_arr: "",
                wrong_answer: localProgressRecord.wrong_answer,
                wrong_answer_arr: (localProgressRecord.wrong_answer_arr).join(","),
                attempt_type: parseInt(new_local.attempt_type),
                no_of_attempt: '1',
                school_id: localStorage.getItem("s_id"),
                is_complete: current_question < questions.length - 2 ? 0 : 1,
                start_time: new Date(),
                no_of_questions: questions.length
            }
            window.saveQuizProgress(payload);
        } else {
            const payload = {
                module_no: id,
                assigned_module_id: assignmentDetails.module_id,
                language: class_info().language,
                student_id: dataProvider().id,
                progress: (localProgressRecord.right_answer_arr.length / current_question * 100).toFixed(2),
                current_question: current_question,
                right_answer: localProgressRecord.right_answer,
                right_answer_arr: [(localProgressRecord.right_answer_arr).join(",")],
                wrong_answer: localProgressRecord.wrong_answer,
                wrong_answer_arr: (localProgressRecord.wrong_answer_arr).join(","),
                attempt_type: parseInt(new_local.attempt_type),
                no_of_attempt: '1',
                school_id: localStorage.getItem("s_id"),
                is_complete: current_question < questions.length - 1 ? 0 : 1,
                start_time: new Date(),
                no_of_questions: questions.length
            }
            window.saveProgress(payload);
        }
    }

    const progressSavingLocal = (type) => {
        switch (type) {
            case 'right_answer':
                setprogressRecord(prev => ({ ...prev, right_answer: prev.right_answer + 1 }));
                break;
            case 'wrong_answer':
                allowWrongIncrement &&
                    setprogressRecord(prev => ({ ...prev, wrong_answer: prev.wrong_answer + 1 }));
                break;
            case 'right_answer_arr':
                // check if percentageValue already exists in right_answer_arr
                if (!progressRecord.right_answer_arr.includes(percentageValue)) {
                    // if percentageValue does not exist in right_answer_arr, add it to the array
                    setprogressRecord(prev => ({
                        ...prev,
                        right_answer_arr: [...prev.right_answer_arr, percentageValue]
                    }));
                }
                break;

            case 'wrong_answer_arr':
                // check if percentageValue already exists in wrong_answer_arr
                if (!progressRecord.wrong_answer_arr.includes(percentageValue)) {
                    // if percentageValue does not exist in wrong_answer_arr, add it to the array
                    setprogressRecord(prev => ({
                        ...prev,
                        wrong_answer_arr: [...prev.wrong_answer_arr, percentageValue]
                    }));
                }
                break;
            case 'question_no':
                localStorage.setItem('current_question', percentageValue);
                break;
            default:
                console.error(`Unrecognized type: ${type}`);
                break;
        }
    }

    useEffect(() => {
        const data = JSON.stringify(progressRecord)
        localStorage.setItem('progressRecord', data)
    }, [progressRecord])



    useEffect(() => {
        if (localStorage.getItem("current_question")) {
            setPercentAgeValue(parseInt(localStorage.getItem("current_question")) + 0);
        }
        const new_local = JSON.parse(localStorage.getItem('assignmentDetails'));
        const payload = {
            student_id: dataProvider().id,
            class_language: class_info().language,
            module_no: id,
            module_id: parseInt(new_local.module_id)
        }
        setrevisions(parseInt(new_local.revision))
        setmoduleType(parseInt(new_local.attempt_type));
        if (new_local.revision !== "") {
            localStorage.setItem("revisions", parseInt(new_local.revision))

        }
        dispatch(getAssignmentProgress(payload))
        if (typeProvider() !== 'student') {
            navigate(-1)
            console.log("No Access")
        } else {
            console.log("Access Given")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const data = useSelector(state => state?.assignmentProgressDetails.details);



    useEffect(() => {

        const current_question = parseInt(localStorage.getItem("current_question"))
        axios.get(`${api2}GetQuestionsNew?target_lang=${class_info().language}&chapter_no=${id}&user_email=nill`)
            .then((res) => {
                let newRes = res.data.data;
                let details = (JSON.parse(localStorage.getItem('assignmentDetails')));
                if (details.time_limit !== "0") {
                    window.counterFunction(details.time_limit)
                }
                if (details?.type === "quiz") {
                    const quizArry = (JSON.parse(localStorage.getItem('selected_questions')));
                    const arr = quizArry.split(",");
                    const filteredRes = newRes.filter((item, index) => quizArry.includes(index.toString()));
                    newRes = filteredRes;

                }
                if (newRes[0].chapter_no === 1) {

                    const updated = [];
                    newRes.forEach((element) => {
                        const updatedPerson = {
                            ...element,
                            hints: element.hints.split("@")[0],
                            hints_description: element.hints_description.split("@")[0],
                        };

                        updated.push(updatedPerson);
                    });


                    let newArr = [];
                    newRes?.forEach((element) => {
                        const { lang_response, hints, hints_description } = element;
                        const newObject = {
                            answer: lang_response,
                            choices: lang_response?.split(' '),
                            // choices: shuffle([choice]),
                            hints: hints?.split('@')[1],
                            hints_description: hints_description?.split('@')[1],
                            images: null,
                            question_type: 3
                        };
                        newArr.push(newObject);
                    });
                    let newArr2 = [];
                    for (let i = 0; i < newRes.length; i++) {
                        newArr2.push(updated[i], newArr[i]);
                    }
                    newRes = newArr2;
                }

                // if for the question type 3
                if (newRes[0].question_type === 3) {
                    setquestions(newRes);
                    setquestionType(newRes[0].question_type);
                    setrandomQuestionArr(newRes[current_question ? current_question : 0].choices);
                    setcurrentAudio(new Audio(`${img}${newRes[current_question ? current_question : 0].question_sound}`))
                    const audio = new Audio(`${img}${newRes[current_question ? current_question : 0].question_sound}`);
                    audio?.play();
                    // else for the question type 1 
                } else if (newRes[0].question_type === 1) {
                    setquestions(newRes);
                    setquestionType(newRes[0].question_type);
                    setcurrentAudio(new Audio(`${img}${newRes[0].question_sound}`))
                    const audio = new Audio(`${img}${newRes[0].question_sound}`);
                    audio?.play();
                }
            }).catch((err) => {
                console.log(err)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const newHintFunction = (res) => {
        let newArr = [];
        if (res && res[0]?.chapter_no === 1) {
            res?.forEach((element) => {
                const { lang_response, hints, hints_description } = element;
                const newObject = {
                    answer: lang_response,
                    choices: lang_response?.split(' '),
                    // choices: shuffle([choice]),
                    hints: hints?.split('@')[1],
                    hints_description: hints_description?.split('@')[1],
                    images: null,
                    question_type: 3
                };
                newArr.push(newObject);
            });
            let newArr2 = [];
            for (let i = 0; i < res.length; i++) {
                newArr2.push(res[i], newArr[i]);
            }
            setquestions(newArr2);
        }
    };


    const incrementValue = () => {
        progressSavingLocal('question_no')
        if (percentageValue <= questions?.length) {
            if (answerArr.join(" ") === questions[percentageValue].answer) {
                if (moduleType === 0) {
                    localStorage.setItem("revisions", revisions);
                }
                setallowWrongIncrement(true)
                progressSavingLocal('right_answer');
                progressSavingLocal('right_answer_arr');
                correctSound.play()
                {
                    const new_local = JSON.parse(localStorage.getItem('assignmentDetails'));
                    new_local.classAssignment === "true" &&
                        setrightAnswer(true);
                }
                if (percentageValue < questions?.length - 1) {
                    setTimeout(() => {
                        saveModuleProgress()
                        setrightAnswer(false)
                        setrandomQuestionArr(questions[percentageValue + 1].choices);
                        setanswerArr([]);
                        setPercentAgeValue(prevValue => prevValue + 1);
                        const audio = new Audio(`${img}${questions[percentageValue + 1].question_sound}`);
                        setcurrentAudio(new Audio(`${img}${questions[percentageValue + 1].question_sound}`))
                        audio.play();
                    }, 1500)
                } else {
                    localStorage.setItem('allow', true);
                    localStorage.removeItem("counter")
                    localStorage.removeItem("remainingTime")
                    localStorage.removeItem('currentLocal')
                    localStorage.removeItem('current_question')
                    localStorage.removeItem('progressRecord');
                    localStorage.removeItem("startTime");
                    navigate(-1)
                    completedAudio.play();
                    window.counterFunction(0, true)
                    Swal.fire(
                        'Success!',
                        'Quiz has been completed.',
                        'success'
                    )
                }
            } else {
                const new_local = JSON.parse(localStorage.getItem('assignmentDetails'));
                if (new_local?.classAssignment === true) {
                    correctSound.play()
                    setTimeout(() => {
                        setrightAnswer(false)
                        setrandomQuestionArr(questions[percentageValue + 1].choices);
                        setanswerArr([]);
                        setPercentAgeValue(prevValue => prevValue + 1);
                        const audio = new Audio(`${img}${questions[percentageValue + 1].question_sound}`);
                        setcurrentAudio(new Audio(`${img}${questions[percentageValue + 1].question_sound}`))
                        audio.play();
                    }, 1200)
                } else {
                    //  indecation of wrong answer 
                    const revision = parseInt(localStorage.getItem('revisions'))
                    if (revisions !== 0) {
                        if (moduleType === 0) {
                            if (revision !== 0) {
                                localStorage.setItem("revisions", revision - 1);
                                wrongSound.play()
                                progressSavingLocal('wrong_answer');
                                progressSavingLocal('wrong_answer_arr');
                                setallowWrongIncrement(false)
                                setwrongAttempt(true)
                                setTimeout(() => {
                                    setwrongAttempt(false)
                                }, 1500)
                            } else {
                                wrongSound2.play()
                                localStorage.setItem("revisions", revisions);
                                setrandomQuestionArr(questions[percentageValue + 1].choices);
                                setanswerArr([]);
                                setPercentAgeValue(prevValue => prevValue + 1);
                                const audio = new Audio(`${img}${questions[percentageValue + 1].question_sound}`);
                                setcurrentAudio(new Audio(`${img}${questions[percentageValue + 1].question_sound}`))
                                audio.play();
                            }
                        } else {
                            if (revision !== 0) {
                                localStorage.setItem("revisions", revision - 1);
                                wrongSound.play()
                                setallowWrongIncrement(false)
                                setTimeout(() => {
                                    setwrongAttempt(false)
                                }, 1500)
                            } else {
                                wrongSound2.play()
                                setwrongAttempt(true)
                                progressSavingLocal('wrong_answer');
                                progressSavingLocal('wrong_answer_arr');
                                setrandomQuestionArr(questions[percentageValue + 1].choices);
                                setanswerArr([]);
                                setPercentAgeValue(prevValue => prevValue + 1);
                                const audio = new Audio(`${img}${questions[percentageValue + 1].question_sound}`);
                                setcurrentAudio(new Audio(`${img}${questions[percentageValue + 1].question_sound}`))
                                audio.play();
                            }
                        }
                    } else {
                        wrongSound.play()
                        progressSavingLocal('wrong_answer');
                        progressSavingLocal('wrong_answer_arr');
                        setallowWrongIncrement(false)
                        setwrongAttempt(true)
                        setTimeout(() => {
                            setwrongAttempt(false)
                        }, 1500)
                    }
                }


            }
        } else {
            // Swal.fire(
            //     'Success!',
            //     'Quiz has been completed.',
            //     'success'
            //   )
        }
    }
    const playCurrentAudio = () => {
        currentAudio.play();
    }

    const selectAns = (option, type) => {
        if (type === 0) {
            // means user selecting the choice 
            if (!answerArr.includes(option)) {
                setanswerArr([...answerArr, option])
                setrandomQuestionArr(randomQuestionArr.filter(item => item !== option))
            }
        } else {
            if (!randomQuestionArr.includes(option)) {
                setrandomQuestionArr([...randomQuestionArr, option])
                setanswerArr(answerArr.filter(item => item !== option))
            }
        }
    }

    const [checkIndex, setcheckIndex] = useState(null);
    const [selectedChoice, setselectedChoice] = useState('');
    const questionTypeSelect = (index, choice) => {
        setcheckIndex(index);
        setselectedChoice(choice);
    }


    const incrementValue2 = () => {
        progressSavingLocal('question_no')
        if (questions[percentageValue].answer === selectedChoice) {
            // new code
            if (moduleType === 0) {
                localStorage.setItem("revisions", revisions);
            }
            setallowWrongIncrement(true)
            progressSavingLocal('right_answer');
            progressSavingLocal('right_answer_arr');
            correctSound.play()
            setrightAnswer(true);
            if (percentageValue < questions?.length - 1) {
                saveModuleProgress()
                setTimeout(() => {
                    setcheckIndex(null);
                    setrightAnswer(false)
                    setPercentAgeValue(prevValue => prevValue + 1);
                    const audio = new Audio(`${img}${questions[percentageValue + 1].question_sound}`);
                    setcurrentAudio(new Audio(`${img}${questions[percentageValue + 1].question_sound}`))
                    audio.play();
                }, 1500)
            } else {
                localStorage.setItem('allow', true);
                localStorage.removeItem("counter")
                localStorage.removeItem("remainingTime")
                localStorage.removeItem('currentLocal')
                localStorage.removeItem('current_question')
                localStorage.removeItem('progressRecord');
                navigate(-1)
                Swal.fire(
                    'Success!',
                    'Quiz has been completed.',
                    'success'
                )
                window.counterFunction(0, true)
            }
        } else {
            //  indecation of wrong answer 
            const revision = parseInt(localStorage.getItem('revisions'))
            if (revisions !== 0) {
                if (moduleType === 0) {
                    if (revision !== 0) {
                        localStorage.setItem("revisions", revision - 1);
                        wrongSound.play()

                        setallowWrongIncrement(false)
                        setwrongAttempt(true)
                        setTimeout(() => {
                            setwrongAttempt(false)
                        }, 1500)
                    } else {
                        wrongSound2.play()
                        progressSavingLocal('wrong_answer');
                        progressSavingLocal('wrong_answer_arr');
                        localStorage.setItem("revisions", revisions);
                        setTimeout(() => {
                            setcheckIndex(null);
                            setrightAnswer(false)
                            setPercentAgeValue(prevValue => prevValue + 1);
                            const audio = new Audio(`${img}${questions[percentageValue + 1].question_sound}`);
                            setcurrentAudio(new Audio(`${img}${questions[percentageValue + 1].question_sound}`))
                            audio.play();
                        }, 1500)
                    }
                } else {
                    if (revision !== 0) {
                        localStorage.setItem("revisions", revision - 1);
                        wrongSound.play()
                        setallowWrongIncrement(false)
                        setwrongAttempt(true)
                        setTimeout(() => {
                            setwrongAttempt(false)
                        }, 1500)
                    } else {
                        wrongSound2.play();
                        progressSavingLocal('wrong_answer');
                        progressSavingLocal('wrong_answer_arr');
                        setTimeout(() => {
                            setcheckIndex(null);
                            setrightAnswer(false)
                            setPercentAgeValue(prevValue => prevValue + 1);
                            const audio = new Audio(`${img}${questions[percentageValue + 1].question_sound}`);
                            setcurrentAudio(new Audio(`${img}${questions[percentageValue + 1].question_sound}`))
                            audio.play();
                        }, 1500)
                    }
                }
            } else {
                wrongSound.play()
                progressSavingLocal('wrong_answer');
                progressSavingLocal('wrong_answer_arr');
                setallowWrongIncrement(false)
                setwrongAttempt(true)
                setTimeout(() => {
                    setwrongAttempt(false)
                }, 1500)
            }
        }
    }


    return (
        <div>
            <StyledAttemptAssignment className={`bg-mirror`}>


                <div className={` ${isModalOpen ? 'disabled' : ""}`}>
                    {
                        showHintModal &&
                        <HintModal hint={hintText} onClose={handleCloseHintModal} />
                    }

                    {
                        questions?.length > 1 &&
                        <>

                            {/* Progress bar to show the user progress */}
                            <h4>Total Questions: {percentageValue} /{questions.length}</h4>
                            {
                                revisions !== 0 &&
                                <div className='top-0 end-0 revisions_id rounded-circle rounded-circle m-3 p-4 text-center'>
                                    <h5 className='p-2'>Revisions</h5>
                                    <h3>{localStorage.getItem('revisions')}/{revisions}</h3>
                                </div>
                            }
                            <ProgressBar
                                questions={questions}
                                percentage={Math.round((percentageValue / questions?.length) * 10000) / 100}
                            />
                            {/* Counter if it is important  */}
                            {/* {detail?.time_limit > 0  && <FixedTimeComponent minutes={parseInt(localStorage.getItem('counter')) > 0 ? parseInt(localStorage.getItem('counter')) / 60 : parseInt(detail.time_limit)} apiCall={apiCall} />} */}

                            <VolumeUpIcon onClick={playCurrentAudio} className='volume_btn' />
                            {
                                questionType === 3 ? (
                                    <>
                                        {
                                            questions?.length > 0 ? (
                                                <div className='questions'>
                                                    <img className={`img_st ${isModalOpen ? 'disabled' : ""}`} src={`${img}${questions[percentageValue]?.question_image}`} alt="..." />
                                                    <br />

                                                    <div className='d-flex justify-content-center m-0 choices_parent' style={{ flexWrap: 'wrap' }}>
                                                        {
                                                            answerArr.map((data, index) => (
                                                                <div key={index} onClick={() => selectAns(data, 1) + unselectAudio.play()} className='choices cursor-pointer'>{data}</div>
                                                            ))
                                                        }
                                                    </div>
                                                    <hr />
                                                    <div className='d-flex justify-content-center m-0 choices_parent' style={{ flexWrap: 'wrap' }}>
                                                        {
                                                            randomQuestionArr?.map((data, index) => (
                                                                <div key={index} onClick={() => selectAns(data, 0) + clickSound.play()} className='choices cursor-pointer'>
                                                                    {

                                                                        (questions[percentageValue].hints).toLowerCase() === data.replace(/[.?]/g, "").toLowerCase() ?
                                                                            <span className='text-decoration-underline' onClick={() => HandleHintClick(questions[percentageValue].hints_description)}>{data}</span> :
                                                                            <span>{data}</span>
                                                                    }
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                    {
                                                        !wrongAttempt ? (
                                                            <Button sx={{ margin: "15px 0 0 0", width: "40%" }} variant="contained" size='large' color={rightAnswer ? "success" : "primary"} disabled={!rightAnswer && answerArr.length < 1} onClick={incrementValue}>
                                                                {rightAnswer ? "Correct" : "Check"}
                                                            </Button>
                                                        ) : (
                                                            <Button sx={{ margin: "15px 0 0 0", width: "40%" }} variant="contained" size='large' color="error">
                                                                Wrong Answer
                                                            </Button>
                                                        )
                                                    }
                                                </div>

                                            ) : (
                                                <>loading</>
                                            )
                                        }
                                    </>
                                ) : (
                                    <>
                                        {
                                            questionType === 1 &&
                                            <>
                                                <h4 className='my-3 mb-4'>{questions[percentageValue]?.question}</h4>
                                                <div className='row m-0 px-3'>

                                                    {
                                                        questions?.[percentageValue].images?.map((data, index) => (
                                                            <div className='col-3 px-2' key={index} >
                                                                <div className={`choice_2 ${checkIndex === index ? 'bg-warning' : 'bg-light'}`} onClick={() => questionTypeSelect(index, questions[percentageValue].choices[index])}>
                                                                    <img className='p-2' width="50%" height="160px" src={`${img}${data}`} alt="..." />
                                                                    <hr className='m-0' />
                                                                    <h5>{questions[percentageValue].choices[index]}</h5>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                {
                                                    !wrongAttempt ? (
                                                        <Button sx={{ margin: "15px 0 0 0", width: "40%" }} variant="contained" size='large' disabled={checkIndex === null} color={rightAnswer ? "success" : "primary"} onClick={incrementValue2}>
                                                            {rightAnswer ? "Correct" : "Check"}
                                                        </Button>
                                                    ) : (
                                                        <Button sx={{ margin: "15px 0 0 0", width: "40%" }} variant="contained" size='large' color="error">
                                                            Wrong Answer
                                                        </Button>
                                                    )
                                                }
                                            </>
                                        }
                                    </>
                                )
                            }
                        </>

                    }
                </div>
            </StyledAttemptAssignment>
        </div>
    )
}

export default AttemptAssignment

const StyledAttemptAssignment = styled.div`
.disabled {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: none;
  background: #0000004c;
}

z-index: -1 ;
text-align: center;
padding: 10px 0;
box-shadow: 0px 21px 39px -25px var(--color4);
border: 1px solid rgb(0,0,0,0.1);
border-radius: 10px;
width: 70%;
margin: 10px auto;
.hint-modal{
    overflow: hidden;
    z-index: 1;
    position: absolute;
    top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400;
  background-color: white;
  border: 2px solid #000;
  box-shadow: 24;
  padding: 4;
  animation: in 0.4s ease-out;
    border-radius: 6px;
    background-color: white;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.2);
    padding: 24px;
}
.hint-modal-content{
    padding:50px;
}
.hint-modal-close{
    margin-right: 20px;
}
.img_st{
    width: 40%;
}
.volume_btn{
    font-size: 40px;
    color: var(--color4);
    cursor: pointer;
}
.volume_btn:hover{
   transform: scale(1.15);
   transition-duration: 140ms;
}
.choices_parent{
    min-height: 68px;
}
.choices{
    border: 1px solid rgb(0,0,0,0.1);
    padding: 10px 15px;
    margin:10px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 1px 3px 1px #0000004c;
    transition-duration: 100ms;
}
.choices:hover{
    transform: scale(0.99);
    box-shadow: 0 0px 0px 0px black;
    transition-duration: 50ms;
}
.choice_2{
    border: 1px solid rgb(0,0,0,0.1);
    border-radius: 5px;
    box-shadow: 0 1px 3px 1px #0000004c;
    transition-duration: 100ms;
    cursor: pointer;
}
.choice_2:hover{
    box-shadow: 0 0 0 0 #0000004c;
    transition-duration: 100ms;
    cursor: pointer;
}
.revisions_id{
    position: absolute;
    background-color: var(--color3);
    color: white;
}
@media (max-width: 450px) {
    .revisions_id{
        position: relative;
width: 40%;
background-color: transparent;
width: 85%;
text-align: center;
color: black;
}    
}
@media(max-width: 768px){
    width: 98%;
    .img_st{
    width: 70%;
    }
}
`