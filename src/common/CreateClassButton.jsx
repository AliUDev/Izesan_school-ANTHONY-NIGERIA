import styled from '@emotion/styled'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';

const CreateClassButton = () => {
  return (
    <StyledAddClassButton>
        <div className="position-fixed bottom-0 end-0 styling">
          <button><AddIcon/></button>
        </div>
    </StyledAddClassButton>
  )
}

export default CreateClassButton

const StyledAddClassButton = styled.div`
z-index: 1000;
button{
  color: white;
  border-radius: 50%;
  background-color: var(--color4);
  height: 60px;
  width: 60px;
  border: 2px solid rgb(0,0,0,0.2);
}
button:hover{
  background-color: var(--color3);
  transform: scale(1.1);
  transition-duration: 100ms;
}
  .styling{
    margin: 0 30px 20px  0;

  }
`