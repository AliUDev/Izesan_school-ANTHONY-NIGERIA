import styled from '@emotion/styled'
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const Heading = (props) => {
    const navigate = useNavigate();
  return (
    <StyledHeading>
        <h3 className='p-3 fw-bolder'><span className='px-3' onClick={()=> props.url ?  navigate(props.url) : navigate(-1)} ><ArrowBackIcon/></span>{props.title? props.title: 'Back' }</h3>
    </StyledHeading>
  )
}

export default Heading

const StyledHeading = styled.div`
display: flex;
h3{
    color: var(--color1);
    text-shadow: 0 1.2px 1px #000000b3;
}
span{
    color: black;
    font-weight: bolder;
    cursor: pointer;
}
span:hover{
    color: var(--color2);
}

`