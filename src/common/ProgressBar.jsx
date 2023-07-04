import React from 'react'
import LinearProgress from '@mui/material/LinearProgress';
import styled from '@emotion/styled';

const ProgressBar = ({ questions, percentage }) => {
    return (
        <StyledProgressBar>
            <div className='progress_bar'>
                <LinearProgress sx={{
                    height: "20px",
                    borderRadius: "5px",
                    backgroundColor: "var(--color1)",
                    "& .MuiLinearProgress-bar": {
                        backgroundColor: "var(--color2)",
                    },
                }} variant="determinate" value={percentage} />
                <p className='mt-2 fs-5 fw-bold'>Progress {`${~~percentage}%`}</p>
                {/* <p>Total Question: {questions?.length}</p> */}
            </div>
        </StyledProgressBar>
    )
}

export default ProgressBar

const StyledProgressBar = styled.div`
text-align: center;
    padding: 0 10px;
    margin-top: 10px;
  @media(min-width: 768px){
    padding: 0 200px;
    margin-top: 10px;
  }
  @media (max-width: 450px) {
    
  }

`