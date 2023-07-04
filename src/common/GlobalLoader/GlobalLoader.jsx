import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styled from '@emotion/styled';
export default function GlobalLoader() {
  return (
    <Wrapper className="position-absolute">
        <CircularProgress className="position-absolute top-50 start-50" color="primary" />
    </Wrapper>
  );
}
const Wrapper = styled.div`
cursor: not-allowed;
background-color:rgb(255,255,255,0.3);
position:absolute;
overflow: hidden;
width: 100%;
height: 100vh;
z-index: 1500;
`