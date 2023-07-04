import React, { useEffect, useState, useMemo } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import {
  fetchDataofassignment,
  fetchDataofmoduleassignment,
} from "../../../../../redux/Features/AssignmentSlice/AssignmentSlice";
import { useDispatch, useSelector } from "react-redux";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import FeedIcon from "@mui/icons-material/Feed";
import {
  chaptersList,
  class_info,
  dataProvider,
} from "../../../../../data.provider";
import chapterimg from "../../../../../assets/images/chapters.png";
import styled from "@emotion/styled";
import { storageApi } from "../../../../../api";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { api } from "../../../../../api";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Loader2 from "../../../../../common/Loader2/Loader2";
import { toast } from "react-toastify";
import AddAssignment from "./AddAssignment";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { typeProvider } from "../../../../../Helper/ParticipantTypeProvider";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import CancelIcon from "@mui/icons-material/Cancel";
import { isDate } from "../../../../../Helper/DateProvider";
import { getAssignmentQuiz } from "../../../../../redux/Features/AssignmentQuizSlice/AssignmentQuizSlice";

const Assignments = ({ params, modal, reset }) => {
  const navigate = useNavigate();
  const [subData, setSubData] = useState([]);
  const dispatch = useDispatch();
  const [subModal, setSubModal] = useState(false);
  const getData = () => {
    dispatch(fetchDataofassignment(params));
    dispatch(fetchDataofmoduleassignment(params));
    dispatch(getAssignmentQuiz({ class_code: class_info().class_code }));
    getVideosAssignment();
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const screenWidth = useMemo(() => {
    return windowWidth;
  }, [windowWidth]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: screenWidth < 768 ? "96%" : "70%",
    bgcolor: "background.paper",
    borderRadius: "20px",
    overflowY: "scroll",
    height: "70vh",
    boxShadow: 24,
    p: 4,
  };
  const sub_module_name = localStorage.getItem("sub_module_name");
  const [open, setOpen] = React.useState(false);
  const [submittedAssignmets, setsubmittedAssignmets] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  /////modulue submission code

  const openMod = () => {
    setSubModal(true);
  };

  const reduxStateDataAssignment = useSelector(
    (state) => state?.assignmentDetails?.allassignment.data
  );
  const reduxStateDataModuleAssignment = useSelector(
    (state) => state?.assignmentDetails?.moduleassignment.data
  );
  const reduxStateQuizAssignment = useSelector(
    (state) => state?.quizAssignmentReducerDetails?.details.data
  );
  const loading = useSelector((state) => state?.assignmentDetails?.isLoading);
  const action = (parameter, path) => {
    window.open(storageApi + path + parameter, "_blank");
  };
  const action2 = (parameter) => {
    axios
      .post(`${api}show-submitted-assignments`, { assignment_id: parameter })
      .then((res) => {
        if (res.data.data.length > 0) {
          setsubmittedAssignmets(res.data.data);
          handleOpen();
        } else {
          toast.info(
            "There is no submitted assignment against this assignment!"
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: screenWidth < 768 ? "96%" : "50%",
    bgcolor: "background.paper",
    borderRadius: "20px",
    overflowY: "scroll",
    height: "auto",
    boxShadow: 24,
    p: 4,
  };
  const openSub = (param) => {
    axios
      .post(`${api}module-assignment-average`, { assigned_module_id: param.id })
      .then((res) => {
        if (res.data?.data && res.data.data.length >= 1) {
          localStorage.setItem("sub_module_name", param.module_name);
          setSubData(res.data.data);
          openMod();
        } else {
          toast.info("There is no submission against this assignment!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (modal === "assignment") {
      handleOpen2();
    }
  }, [modal]);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => {
    reset();
    setOpen2(false);
  };
  ////////////submit assignment by student
  const [addWork, setaddWork] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [assiData, setAssiData] = useState([]);
  const currentDate = new Date();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const submitAssi = (param) => {
    setAssiData(param);
    AddOpen();
  };
  const addwork = () => {
    if (selectedFile === "" || selectedFile === null) {
      toast.error("File is Required");
    } else {
      axios
        .post(
          `${api}assignment-submission`,
          {
            total_grade: assiData.points,
            submission_date: currentDate,
            submitted_assignment: selectedFile,
            submitted_by: 11,
            class_code: assiData.class_code,
            student_id: 11,
            assignment_id: assiData.id,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          if (res.data.status === "success") {
            toast.info("Work Sumbitted Successfull");
            setaddWork(false);
            setSelectedFile(null);
          } else {
            toast.error("Something Went Wrong!");
          }
        })
        .catch((err) => {
          console.log(err);
          setSelectedFile(null);
          setaddWork(false);
        });
    }
  };
  const AddOpen = () => {
    setaddWork(true);
  };
  const deleteFileAssignment = (id) => {
    Swal.fire({
      title: "Do you want to delete this file assignment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${api}delete-assignment?id=${id}`)
          .then((res) => {
            dispatch(fetchDataofassignment(params));
            toast.info(res.data.message);
            Swal.fire(
              "Deleted!",
              "File Assignment has been deleted.",
              "success"
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  const deleteModuleAssignment = (id) => {
    Swal.fire({
      title: "Do you want to delete this module assignment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .get(`${api}delete-module-assignment?id=${id}`)
          .then((res) => {
            dispatch(fetchDataofmoduleassignment(params));
            toast.info(res.data.message);
            Swal.fire(
              "Deleted!",
              "Module Assignment has been deleted.",
              "success"
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  const deleteQuizModule = (id) => {
    Swal.fire({
      title: "Do you want to delete this module assignment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${api}delete-quiz`, { id: id })
          .then((res) => {
            toast.info(res.data.message);
            Swal.fire(
              "Deleted!",
              "Module Assignment has been deleted.",
              "success"
            );
            dispatch(
              getAssignmentQuiz({ class_code: class_info().class_code })
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  const openModuleAssignment = (moduleIndex, data) => {
    const { time_limit, revision, id, attempt_type, language } = data;
    axios
      .get(
        `${api}get-school-chapter-progress?module_no=${
          Number(moduleIndex) + 1
        }&assigned_module_id=${id}&language=${language}&student_id=${
          dataProvider().id
        }`
      )
      .then((res) => {
        // if (res.data.data[0].is_complete === 0 || res.data.code === 400 ) {
        typeProvider() === "student" &&
          navigate(`/test/${Number(moduleIndex) + 1}`);
        const object = {
          time_limit: time_limit,
          revision: revision,
          module_id: id,
          attempt_type: attempt_type,
        };
        localStorage.setItem("assignmentDetails", JSON.stringify(object));
        localStorage.setItem("current_question", 0);
        localStorage.removeItem("counter");
        // } else {
        //   Swal.fire("Oops!", "You already have attempted this assignment!")
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openQuizAssignment = (moduleIndex, data) => {
    const { time_limit, revision, id, attempt_type, is_complete } =
      data;
    // axios
    //   .get(
    //     `${api}get-quiz-progress?module_no=${
    //       Number(moduleIndex) + 1
    //     }&quiz_id=${id}&language=${language}&student_id=${
    //       dataProvider().id
    //     }`
    //   )
    //   .then((res) => {
    // console.log(res, "QuizRes")
    // if(res.data.is_complete === 0 || res.data.code === 400 )
    if (is_complete !== 1) {
      typeProvider() === "student" &&
        navigate(`/test/${Number(moduleIndex) + 1}`);
      const object = {
        time_limit: time_limit,
        revision: revision,
        module_id: id,
        attempt_type: attempt_type,
        type: "quiz",
        selected_questions: data.selected_questions,
      };
      localStorage.setItem("assignmentDetails", JSON.stringify(object));
      localStorage.setItem(
        "selected_questions",
        JSON.stringify(data.selected_questions)
      );
      localStorage.setItem("current_question", 0);
      localStorage.removeItem("counter");
    } else {
      Swal.fire( "You already have attempted this assignment!");
    }
    //   else{
    //     Swal.fire("Oops!", "You already have attempted this assignment!");
    //   }
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
  };

  const [videos, setvideos] = useState([]);
  const [videoLoader, setvideoLoader] = useState(false);
  const getVideosAssignment = () => {
    setvideoLoader(true);
    axios
      .get(`${api}get-assign-videos?class_code=${class_info().class_code}`)
      .then((res) => {
        setvideos(res?.data?.data);
        setvideoLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setvideoLoader(false);
      });
  };

  const deleteVideo = (param) => {
    Swal.fire({
      title: "Do you want to delete this video assignment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${api}delete-assign-videos`, { id: param })
          .then((res) => {
            Swal.fire(
              "Deleted!",
              "This Video Assignment has been deleted.",
              "success"
            );
            getVideosAssignment();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <StyledAssignment>
      {/* Modal for add assinment  */}
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2}>
      
          <AddAssignment updateState={getData} closeUpdate={handleClose2} />
        </Box>
      </Modal>
      {/* Modal Code For Submitted Assignements  */}
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <CancelIcon className="cursor-pointer " onClick={handleClose} />
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            All Submitted Assignments:
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            {submittedAssignmets.map((data, index) => (
              <div className="border mb-3 rounded" key={index}>
                <div className="pt-3 pb-2 px-3 bg1 rounded-top">
                  <p className="fw-bold">
                    <FeedIcon sx={{ color: "white" }} /> {data.submitted_by}
                  </p>
                </div>
                <div className="p-3 pb-3">
                  <p>Date of submission: {data.submission_date}</p>
                  <div>
                    <InsertLinkIcon />{" "}
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        action(
                          data.submitted_assignment,
                          "submitted_assignment/"
                        )
                      }
                    >
                      See Attachment
                    </span>{" "}
                  </div>
                </div>
              </div>
            ))}
          </Typography>
        </Box>
      </Modal>
      {subModal && (
        <Modal
          open={openMod}
          onClose={() => setSubModal(false)}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style}>
            <CancelIcon
              className="cursor-pointer"
              onClick={() => setSubModal(false)}
            />
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
            >
              <div className="row">
                {subData?.map((data, index) => (
                  <div
                    key={index}
                    className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 text-start m-0 p-0 mb-4"
                  >
                    <div className="childs px-lg-3  py-1 pt-3 rounded-top">
                      <div className="bg-light rounded shadow">
                        <div className="pt-3 pb-2 px-3 bg1 rounded-top">
                          <div className="col-11">
                            <h5>
                              <InsertLinkIcon sx={{ color: "white" }} /> Module
                              Assigment
                            </h5>
                          </div>
                        </div>
                        <div className="p-3 pb-0">
                          <p>Attempt By: {data?.details[0]?.student_name}</p>
                          <p>Prograss:{data?.details[0]?.progress}% </p>
                        </div>
                        <div className="row mb-2 rounded-bottom m-0 py-2 chapters_list">
                          <div className="col-4">
                            <img
                              width="100%"
                              src={chapterimg}
                              alt="chapterimg"
                            />
                          </div>
                          <div className="col-8">
                            <p>{sub_module_name}</p>
                            <div className="row">
                              <p className="col-4"></p>
                              <p className="col-4">
                                {data?.details[0]?.right_answer}{" "}
                                <CheckIcon className="text-success" />
                              </p>
                              <p className="col-4">
                                {data?.details[0]?.wrong_answer}{" "}
                                <CloseIcon className="text-danger" />
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Typography>
            <Typography
              id="keep-mounted-modal-description"
              sx={{ mt: 2 }}
            ></Typography>
          </Box>
        </Modal>
      )}
      {addWork && (
        <Modal
          open={openMod}
          onClose={() => setaddWork(false)}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style}>
            <CancelIcon
              className="cursor-pointer"
              onClick={() => setaddWork(false)}
            />
            {assiData ? (
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-start m-0 p-0 mb-4">
                <div className="childs px-lg-3  py-1 pt-3 rounded-top">
                  <div className="bg-light rounded shadow">
                    <div className="pt-3 pb-2 px-3 bg1 rounded-top">
                      <div className="row">
                        <div className="col-11">
                          <h5>
                            <FeedIcon sx={{ color: "white" }} />{" "}
                            {assiData.title}
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 pb-0">
                      <p>Deadline: {assiData.deadline}</p>
                      <p>Points: {assiData.points}</p>
                    </div>
                    <hr />
                    <div className="row px-3 pb-3">
                      <div className="col-6">
                        <InsertLinkIcon />{" "}
                        <span
                          className="cursor-pointer"
                          onClick={() =>
                            action(assiData.attachment, "student/")
                          }
                        >
                          See Attachment
                        </span>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 px-3 mb-3">
                <Button className="w-100" variant="contained" component="label">
                  <InsertLinkIcon className="m-2" />
                  {selectedFile ? selectedFile.name : "Add Work"}
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                <Button className="w-100 m-1" onClick={addwork}>
                  {" "}
                  Submit{" "}
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
      )}

      {/* Body Code Starts From There  */}

      <h4 className="text-start">Assignments:</h4>
      {loading ? (
        <Loader2 />
      ) : (
        <>
          {!loading && !reduxStateDataAssignment ? (
            <p>No Assignment</p>
          ) : (
            <div className="row m-0">
              {reduxStateDataAssignment?.map((data, index) => (
                <div
                  key={index}
                  className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 text-start m-0 p-0 mb-4"
                >
                  <div className="childs px-lg-3  py-1 pt-3 rounded-top">
                    <div className="bg-light rounded shadow">
                      <div className="pt-3 pb-2 px-3 bg1 rounded-top">
                        <div className="row">
                          <div className="col-11">
                            <h5>
                              <FeedIcon sx={{ color: "white" }} /> {data.title}
                            </h5>
                          </div>
                          {typeProvider() !== "student" && (
                            <div className="col-1">
                              <DeleteIcon
                                className="delete_icon "
                                onClick={() => deleteFileAssignment(data.id)}
                                sx={{ color: "white", cursor: "pointer" }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-3 pb-0">
                        <p>Deadline: {data.deadline}</p>
                        <p>Points: {data.points}</p>
                      </div>
                      <hr />
                      <div className="row px-3 pb-3">
                        <div className="col-6">
                          <InsertLinkIcon />{" "}
                          <span
                            className="cursor-pointer"
                            onClick={() => action(data.attachment, "student/")}
                          >
                            See Attachment
                          </span>{" "}
                        </div>
                        {typeProvider() !== "student" ? (
                          <div
                            className="col-6 text-end cursor-pointer"
                            onClick={() => action2(data.id)}
                          >
                            Submissions
                          </div>
                        ) : (
                          <div
                            className="col-6 text-end cursor-pointer"
                            onClick={() => submitAssi(data)}
                          >
                            Submit
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <h4 className="text-start ">Module Assignments:</h4>
      {localStorage.getItem("allow") === "false" && (
        <Alert variant="outlined" severity="warning">
          Complete your current assignment in progress first to attempt next
          assignment!
        </Alert>
      )}
      {loading ? (
        <Loader2 />
      ) : (
        <>
          {!loading && !reduxStateDataModuleAssignment ? (
            <p>No Module Assignment</p>
          ) : (
            <div className="row m-0">
              {reduxStateDataModuleAssignment?.map((data, index) => (
                <div
                  key={index}
                  className={`col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 text-start m-0 p-0 mb-4 ${
                    localStorage.getItem("allow") === "false" &&
                    "disabeling_class"
                  } `}
                >
                  <div className="childs px-lg-3 py-1 pt-3 rounded-top">
                    <div
                      className={`rounded bg-light shadow-sm ${
                        isDate(data.deadline)
                          ? "cursor-pointer"
                          : ` ${
                              typeProvider() === "student" &&
                              "pointer-events-none"
                            } `
                      }`}
                    >
                      <div className="pt-3 pb-2 px-3 bg1 rounded-top">
                        <div className="row">
                          <div className="col-11">
                            <h5>
                              <FeedIcon sx={{ color: "white" }} />{" "}
                              {data.module_name}
                            </h5>
                          </div>
                          {typeProvider() !== "student" && (
                            <div className="col-1">
                              <DeleteIcon
                                className="delete_icon"
                                onClick={() => deleteModuleAssignment(data.id)}
                                sx={{ color: "white", cursor: "pointer" }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-3 pb-0">
                        <p>Deadline: {data.deadline}</p>
                        <p>Revisions: {data.revision}</p>
                        {data.attempt_type === 0 ? (
                          <p>Revision Type: Per Question</p>
                        ) : (
                          <p>Revision Type: Per Module</p>
                        )}
                        {data.time_limit > 0 && (
                          <p>Time: {data.time_limit} Minutes</p>
                        )}
                      </div>
                      <hr className="p-0 m-0" />
                      {data.selected_modules
                        .split(/[, ]+/)
                        .map((moduleIndex) => (
                          <div
                            className={`row mb-2 rounded-bottom m-0 py-2  ${
                              typeProvider() === "student"
                                ? "cursor-pointer chapters_list"
                                : ""
                            }`}
                            key={moduleIndex}
                            onClick={() =>
                              openModuleAssignment(moduleIndex, data)
                            }
                          >
                            <div className="col-4">
                              <img
                                width="100%"
                                src={chapterimg}
                                alt="chapterimg"
                              />
                            </div>
                            <div className="col-8">
                              <p className="mt-3">
                                {chaptersList[moduleIndex]}
                              </p>
                            </div>
                          </div>
                        ))}
                      {typeProvider() !== "student" && (
                        <>
                          <hr className="p-0 m-0" />
                          <div className="d-flex w-100 justify-content-end">
                            <span
                              className="text-end m-3 cursor-pointer"
                              onClick={() => openSub(data)}
                            >
                              Submissions
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <div>
        <h4 className="text-start">Quiz Assignments</h4>
        {loading ? (
          <Loader2 />
        ) : (
          <>
            {!loading && !reduxStateQuizAssignment ? (
              <p>No Quiz Assignment</p>
            ) : (
              <div className="row m-0">
                {reduxStateQuizAssignment?.map((data, index) => (
                  <div
                    key={index}
                    className={`col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 text-start m-0 p-0 mb-4 ${
                      localStorage.getItem("allow") === "false" &&
                      "disabeling_class"
                    } `}
                  >
                    <div className="childs px-lg-3 py-1 pt-3 rounded-top">
                      <div
                        className={`rounded bg-light shadow-sm ${
                          isDate(data.deadline)
                            ? "cursor-pointer"
                            : ` ${
                                typeProvider() === "student" &&
                                "pointer-events-none"
                              } `
                        }`}
                      >
                        <div className="pt-3 pb-2 px-3 bg1 rounded-top">
                          <div className="row">
                            <div className="col-11">
                              <h5>
                                <FeedIcon sx={{ color: "white" }} />{" "}
                                {data.module_name}
                              </h5>
                            </div>
                            {typeProvider() !== "student" && (
                              <div className="col-1">
                                <DeleteIcon
                                  className="delete_icon"
                                  onClick={() => {
                                    deleteQuizModule(data.id);
                                  }}
                                  sx={{ color: "white", cursor: "pointer" }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-3 pb-0">
                          <p>Deadline: {data.deadline}</p>
                          <p>Revisions: {data.revision}</p>
                          {data.attempt_type > 0 ? (
                            <p>Revision Type: Per Module</p>
                          ) : (
                            <p>Revision Type: Per Question</p>
                          )}
                          {data.time_limit > 0 && (
                            <p>Time: {data.time_limit} Minutes</p>
                          )}
                        </div>
                        <hr className="p-0 m-0" />
                        {typeProvider() === "student" ? (
                          <div
                            className="row mb-2 rounded-bottom m-0 py-2  cursor-point chapters_list"
                            onClick={() =>
                              openQuizAssignment(
                                parseInt(data.assigned_module_id),
                                data
                              )
                            }
                          >
                            <div className="col-4">
                              <img
                                width="100%"
                                src={chapterimg}
                                alt="chapterimg"
                              />
                            </div>
                            <div className="col-8">
                              <p className="mt-3">
                                {
                                  chaptersList[
                                    parseInt(data.assigned_module_id)
                                  ]
                                }
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="row mb-2 rounded-bottom m-0 py-2">
                            <div className="col-4">
                              <img
                                width="100%"
                                src={chapterimg}
                                alt="chapterimg"
                              />
                            </div>
                            <div className="col-8">
                              <p className="mt-3">
                                {
                                  chaptersList[
                                    parseInt(data.assigned_module_id)
                                  ]
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <h4 className="text-start">Videos:</h4>
      {videoLoader ? (
        <Loader2 />
      ) : (
        <>
          {videos?.length < 1  || videos === "" || videos === null || videos === undefined  || !videos ?(
            <p>No Video Assignment</p>
          ) : (
            <div className="row m-0">
              {videos?.map((data, index) => (
                <div
                  key={index}
                  className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 text-start m-0 p-0 mb-4"
                >
                  <div className="childs px-lg-3  py-1 pt-3 rounded-top">
                    <div className="bg-light rounded shadow">
                      <div className="pt-3 pb-2 px-3 bg1 rounded-top">
                        <div className="row">
                          <div className="col-11">
                            <h5>
                              <FeedIcon sx={{ color: "white" }} /> Video of{" "}
                              {data.language}
                            </h5>
                          </div>
                          {typeProvider() !== "student" && (
                            <div className="col-1">
                              <DeleteIcon
                                className="delete_icon "
                                onClick={() => deleteVideo(data.id)}
                                sx={{ color: "white", cursor: "pointer" }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row rounded-bottom pt-3">
                        <div className="col-4">
                          <img width="100%" src={chapterimg} alt="chapterimg" />
                        </div>
                        <div className="col-8 text-truncate">{data.title}</div>
                      </div>
                      <hr />
                      <div className="row px-3 pb-3">
                        <div className="col-6">
                          <InsertLinkIcon />{" "}
                          <span
                            className="cursor-pointer"
                            onClick={() => action(data.video, "SchoolVideo/")}
                          >
                            See Attachment
                          </span>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </StyledAssignment>
  );
};

export default Assignments;

const StyledAssignment = styled.div`
  .chapters_list {
    box-shadow: 0px 2px 3px -1px #0000004a;
  }
  .chapters_list:hover {
    /* transform: scale(0.98); */
    box-shadow: 0px 0px 0px 0px #0000004a;
    background-color: rgb(0, 0, 0, 0.09);
    transition-duration: 100ms;
    cursor: pointer;
  }
  .disabeling_class {
    opacity: 0.6;
    pointer-events: none !important;
  }
  .delete_icon:hover {
    color: red;
  }
`;
