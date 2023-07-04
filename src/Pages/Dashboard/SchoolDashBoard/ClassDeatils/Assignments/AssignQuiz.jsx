import React, { useCallback, useState } from "react";
import {
  chaptersList,
  class_info,
  encryptedData,
} from "../../../../../data.provider";
import chapters_img from "../../../../../assets/images/chapters.png";
import styled from "@emotion/styled";
import { dataProvider } from "../../../../../data.provider";
import axios from "axios";
import { api } from "../../../../../api";
import QuestionModal from "../../../../../common/QuestionModal";
import Loader2 from "../../../../../common/Loader2/Loader2";
const AssignQuiz = ({ close, closeUpdate }) => {
  const [currentQuestions, setcurrentQuestions] = useState([]);
  const [modal, setmodal] = useState(false);
  const [module, setmodule] = useState([]);
  const [loader, setloader] = useState(false);

  const getQuestion = useCallback((index) => {
    setcurrentQuestions([]);
    let email;
    if (localStorage.getItem("encrypted_data_ts")) {
      email = dataProvider().teacher_email;
    } else {
      email = encryptedData().email_id;
    }
    let chapter_type;
    if (index < 5) {
      chapter_type = 3;
    } else {
      chapter_type = 1;
    }
    setloader(true);
    axios
      .get(
        `${api}GetQuestionsNew?chapter_no=${
          index + 1
        }&chapter_type=${chapter_type}&target_lang=${
          class_info().language
        }&user_email=${email}`
      )
      .then((res) => {
        setcurrentQuestions(res.data.data);
        setmodule([chaptersList[index], index + 1]);

        setmodal(true);
        setloader(false);
      })
      .catch((err) => {
        console.log(err);
        setloader(false);
      });
  },[]);

  return (
    <>
      {loader ? (
        <div className="position-absolute top-50 start-50 translate-middle" >
          <Loader2 />
        </div>
      ) : (
        <>
          <StyledAssignQuiz>
            <div className="row">
              <h3 className="mb-3 text-center">
                Select Quiz Lesson and its Questions
              </h3>
              {chaptersList.map((data, index) => (
                <div
                  className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12  mb-3 px-2 m-0"
                  key={index}
                  onClick={() => getQuestion(index)}
                >
                  <div className={`row border m-0 rounded option`}>
                    <div
                      className="col-5 div_bg"
                      style={{ backgroundImage: `url(${chapters_img})` }}
                    ></div>
                    <div className="col-7">
                      <p className="fw-bolder p-0 my-0 pt-2">{data}</p>
                      <p className="p-0 m-0">Lesson No {index + 1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <QuestionModal
              module={module}
              openState={modal}
              openFunction={setmodal}
              close={close}
              closeUpdate={closeUpdate}
              questions={currentQuestions}
            />
          </StyledAssignQuiz>
        </>
      )}
    </>
  );
};

export default AssignQuiz;

const StyledAssignQuiz = styled.div`
  .option {
    height: 85px;
  }
  .option:hover {
    transform: scale(1.01);
    cursor: pointer;
    box-shadow: 0 2px 3px 0px rgb(0 0 0 / 41%);
  }
  .div_bg {
    background-image: url("path/to/image.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }
`;
