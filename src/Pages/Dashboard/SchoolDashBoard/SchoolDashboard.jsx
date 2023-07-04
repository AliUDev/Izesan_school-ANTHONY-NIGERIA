import styled from '@emotion/styled'
import React, { useState, useRef } from 'react'
import SideList from './SideList';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
const SchoolDashboard = () => {
  const [teacherOption, setteacherOption] = useState(true);
  const [studentOption, setstudentOption] = useState(false);
  const targetRef = useRef(null);

  const handleClick = () => {
    targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest', offsetTop: 150 });
  };
  const optionState = (key) => {
    if (key === 'teacher') {
      handleClick()
      setteacherOption(true);
      setstudentOption(false);

    }
    if (key === 'student') {
      handleClick()
      setstudentOption(true);
      setteacherOption(false);
    }
  }

  return (
    <StyledSchoolDashBoard>
      <div className="container-fluid">
        <div className="row g-4 mt-1 ">
          <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12 ">
            <div className="p-4 border bg-mirror wrapper rounded-4">
              <h3>Dashboard</h3>
              <div className="row g-2 w-100 text-center mt-2">
                <div className="col-6">
                  <div className="border teacher_div rounded-4 border" style={{ opacity: `${teacherOption ? "" : "0.4"}`, backgroundColor: `${teacherOption ? "var(--color4)" : "#a8a8a8"}` }} onClick={() => optionState('teacher')}>
                    <h4>Teachers</h4>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border school_div rounded-4 border" style={{ opacity: `${studentOption ? "" : "0.4"}`, backgroundColor: `${studentOption ? "var(--color3)" : "#a8a8a8"}` }} onClick={() => optionState('student')}>
                    <h4>Students</h4>
                  </div>
                </div>
              </div>
              <div className='py-4' >
                <h3> {teacherOption ? 'Add Teacher' : 'Add Students'}</h3>
                <Link style={{ display:"inline-block", width:"40%" }} to={teacherOption ? '/add-teacher' : '/add-student'} >
                  <div className="border add_div rounded-4 w-100 border text-center mt-3" >
                    <AddIcon className='fs-2' />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 text-center" >
            <div className="p-3 border bg-mirror rounded-4 sideList" ref={targetRef}>
              <SideList listOf={teacherOption} />
            </div>
          </div>
        </div>
      </div>
    </StyledSchoolDashBoard>
  )
}

export default SchoolDashboard

const StyledSchoolDashBoard = styled.div`
.wrapper{
  height: 100%!important;
}
.teacher_div{
background-color: var(--color4);
color: white;
cursor: pointer;
padding: 55px 0;
}
.school_div{
background-color:var(--color3);
color: white;
cursor: pointer;
padding: 55px 0;
}
.add_div{
background-color: var(--color2);
color: white;
cursor: pointer;
padding: 55px 0;
width: 49%;
}
.school_div:hover , .teacher_div:hover , .add_div:hover{
transform: scale(1.02);
transition-duration: 150ms;
opacity: 1 !important;
}
.add_div:hover{
transform: scale(1.02);
background-color: var(--color1);
transition-duration: 150ms;
opacity: 1 !important;
}
.sideList{
 height:83vh;
 overflow: scroll;
}
@media(max-width: 767px){
  .teacher_div, .school_div{
    padding: 35px 0;
  }
  .sideList{
 height:auto;
}
}

@media(max-width: 576px){
  .add_div{
    padding: 30px 0;
}
}

`