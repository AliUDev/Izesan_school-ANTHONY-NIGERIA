import React from 'react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const Stepper1 = ({ arr, activeValue }) => {
    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeValue} alternativeLabel>
                    {arr?.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </div>
    )
}

export default Stepper1