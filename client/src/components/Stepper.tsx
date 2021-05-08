import { useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { WithStyles } from '@material-ui/core'

import clsx from 'clsx'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import Paper from '@material-ui/core/Paper'
import CssBaseline from '@material-ui/core/CssBaseline'
import StepLabel from '@material-ui/core/StepLabel'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import FindInPageIcon from '@material-ui/icons/FindInPage'
import StepConnector from '@material-ui/core/StepConnector'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { register } from './styles'

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22
  },
  active: {
    '& $line': {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
    }
  },
  completed: {
    '& $line': {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
    }
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1
  }
})(StepConnector)

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    // color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  active: {
    backgroundImage: 'linear-gradient(180deg, rgba(169,198,217,1) 15%, rgba(242,167,75,1) 90%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
  },
  completed: {
    backgroundImage: 'linear-gradient(180deg, rgba(169,198,217,1) 15%, rgba(242,167,75,1) 90%)'
  }
})

const ColorlibStepIcon = (props: { active: boolean; completed: boolean; icon: number }) => {
  const classes = useColorlibStepIconStyles()
  const { active, completed, icon } = props

  const icons = new Map<number, JSX.Element>()
  icons.set(1, <AccountCircleIcon />)
  icons.set(2, <CloudUploadIcon />)
  icons.set(3, <FindInPageIcon />)

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed
      })}
    >
      {icons.get(icon)}
    </div>
  )
}

const getSteps = () => ['Login', 'Upload a knowledge source', 'Ask your knowledge source']

const getStepContent = (step: number) => {
  switch (step) {
    case 0:
      return 'Select campaign settings...'
    case 1:
      return 'What is an ad group anyways?'
    case 2:
      return 'This is the bit I really care about!'
    default:
      return 'Unknown step'
  }
}
interface Props extends WithStyles<typeof register> {}

const CustomizedSteppers = (props: Props) => {
  const { classes } = props

  const [activeStep, setActiveStep] = useState(1)
  const steps = getSteps()

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <div className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <Stepper
          alternativeLabel
          style={{ backgroundColor: 'transparent' }}
          activeStep={activeStep}
          connector={<ColorlibConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>All steps completed - you&apos;re finished</Typography>
              <Button onClick={handleReset} className={classes.button}>
                Reset
              </Button>
            </div>
          ) : (
            <div>
              <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.button}
                  style={{ marginRight: '20px' }}
                >
                  Back
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext} className={classes.button}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Paper>
    </div>
  )
}

export default withStyles(register)(CustomizedSteppers)
