import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import GradeIcon from "@mui/icons-material/Grade";
import ClassWorks from "./ClassWorks/ClassWorks";
import CurrentTestBtn from "../../../../common/CurrentTestBtn";
import Assignments from "./Assignments/Assignments";
import Students from "./Students/Students";
import GradeBook from "./GradeBook/GradeBook";
import { Settings } from "@mui/icons-material";
import Setting from "./Setting/Setting";
import Heading from "../../../../common/Heading";
import styled from "@emotion/styled";
import CreateClassButton from "../../../../common/CreateClassButton";
import { typeProvider } from "../../../../Helper/ParticipantTypeProvider";
const ClassDetails = () => {
  const params = useParams();
  let id_curr = localStorage.getItem("param");
  const navigate = useNavigate();
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const style = {
    width: "100%",
    typography: "body1",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: "15px",
    backdropFilter: "blur(3px)",
    boxShadow: "0 0 3px 2px rgb(0,0,0,0.3)",
    minHeight: "400px",
    textAlign: "center",
  };
  const reset = () => {
    setmodalCondition(0);
  };
  const [modalCondition, setmodalCondition] = useState(0);
  const openModal = () => {
    setmodalCondition(value);
  };

  return (
    <StyledClassesDetails>
      {typeProvider() === "student" && localStorage?.getItem("counter") && (
        <div
          className="go-back-div"
          onClick={() => navigate(`/test/${id_curr}`)}
        >
          <CurrentTestBtn />
        </div>
      )}
      <Heading heading="Class Detail" />
      <div className="parent_tab_div">
        <Box sx={style}>
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                justifyContent: "center",
                display: "flex",
                backgroundColor: 'var(--color1)',
                borderRadius:"15px 15px 0 0px",
              }}
            >
              <TabList
                onChange={handleChange}
                scrollButtons
                allowScrollButtonsMobile
                variant="scrollable"
              >
                <Tab icon={<AutoStoriesIcon />} label="ClassWork" value="1" />
                <Tab icon={<AssignmentIcon />} label="Assignments" value="2" />
                <Tab icon={<GroupsIcon />} label="Students" value="3" />
                <Tab icon={<GradeIcon />} label="GradeBook" value="4" />
                <Tab icon={<Settings />} label="Setting" value="5" />
                {/* <Tab icon={<Settings />} label="Assign Video" value="6" /> */}
              </TabList>
            </Box>
            <TabPanel value="1">
              <ClassWorks
                params={params.id}
                modal={modalCondition === "1" && "classwork"}
                reset={reset}
              />
            </TabPanel>
            <TabPanel value="2">
              <Assignments
                params={params.id}
                modal={modalCondition === "2" && "assignment"}
                reset={reset}
              />
            </TabPanel>
            <TabPanel value="3">
              <Students
                params={params.id}
                modal={modalCondition === "3" && "student"}
                reset={reset}
              />
            </TabPanel>
            <TabPanel value="4">
              <GradeBook params={params.id} />
            </TabPanel>
            <TabPanel value="5">
              <Setting params={params.id} />
            </TabPanel>
          </TabContext>
        </Box>
      </div>
      {typeProvider() !== "student" && value !== "4" && value !== "5" && (
        <div onClick={() => openModal()}>
          <CreateClassButton />
        </div>
      )}
    </StyledClassesDetails>
  );
};

export default ClassDetails;

const StyledClassesDetails = styled.div`
  .go-back-div {
    position: absolute;
    left: 90%;
  }
  .parent_tab_div {
    padding: 0 13%;
  }
  @media (max-width: 767px) {
    .parent_tab_div {
      padding: 0;
    }
  }
`;
