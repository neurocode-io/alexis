import React, { useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { WithStyles, Button } from '@material-ui/core'
import { DropzoneArea, FileObject, PreviewIconProps } from 'material-ui-dropzone'

import clsx from 'clsx'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import FindInPageIcon from '@material-ui/icons/FindInPage'
import PictureAsPdf from '@material-ui/icons/PictureAsPdf'
import StepConnector from '@material-ui/core/StepConnector'

import Typography from '@material-ui/core/Typography'
import { main } from './styles'
import Query from './Query'

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

const handlePdfPreview = (fileObj: FileObject, classes: PreviewIconProps) => {
  const iconProps = {
    //@ts-ignore
    className: classes.image
  }

  return <PictureAsPdf {...iconProps} />
}

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
  icons.set(1, <CloudUploadIcon />)
  icons.set(2, <FindInPageIcon />)

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

const getSteps = () => ['Knowledge source', 'Query']

const getStepContent = (step: number) => {
  switch (step) {
    case 0:
      return 'Upload a Knowledge source. Currently only PDFs are supported.'
    case 1:
      return 'Search your documents with natural questions!'
    default:
      return 'Unknown step'
  }
}
const upload = (file: File) => {
  const data = new FormData()
  data.append('file-to-upload', file)

  fetch('/knowledge-source/pdf', {
    method: 'POST',
    body: data
  })
    .then((response) => response.json())
    .then((success) => console.log(success))
    .catch((error) => console.log(error))
}

interface Props extends WithStyles<typeof main> {}

const CustomizedSteppers = (props: Props) => {
  const [files, setFiles] = useState<File[]>()

  const { classes } = props

  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()

  const handleNext = async (activeStep: number) => {
    if (activeStep === 0 && files && files.length > 0) {
      console.log('upload')
      await Promise.all(files.map((file: File) => upload(file)))
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <>
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
      <div style={{ display: 'contents' }}>
        <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
        {activeStep === 0 ? (
          <DropzoneArea
            getPreviewIcon={handlePdfPreview}
            acceptedFiles={['application/pdf']}
            dropzoneText="Drag and your PDFs here or click"
            filesLimit={5}
            showFileNamesInPreview
            maxFileSize={30 * 1e6}
            dropzoneClass={classes.dropzone}
            onChange={(files) => setFiles(files)}
          />
        ) : (
          <Query />
        )}
        <div>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            className={classes.button}
            style={{ marginRight: '20px' }}
          >
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleNext(activeStep)} className={classes.button}>
            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
    </>
  )
}

export default withStyles(main)(CustomizedSteppers)
