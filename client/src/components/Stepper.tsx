import { useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { WithStyles, Button } from '@material-ui/core'
import {
  DropzoneArea,
  FileObject,
  PreviewIconProps,
} from 'material-ui-dropzone'

import clsx from 'clsx'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import FindInPageIcon from '@material-ui/icons/FindInPage'
import PictureAsPdf from '@material-ui/icons/PictureAsPdf'
import StepConnector from '@material-ui/core/StepConnector'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'

import Typography from '@material-ui/core/Typography'
import { main } from './styles'
import Query from './Query'
import { actions, usePdf } from '../store'

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector)

const handlePdfPreview = (fileObj: FileObject, classes: PreviewIconProps) => {
  const iconProps = {
    //@ts-ignore
    className: classes.image,
  }

  return <PictureAsPdf {...iconProps} />
}

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient(180deg, rgba(169,198,217,1) 15%, rgba(242,167,75,1) 90%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
})

const ColorlibStepIcon = (props: { active: boolean; icon: number }) => {
  const classes = useColorlibStepIconStyles()
  const { active, icon } = props

  const icons = new Map<number, JSX.Element>()
  icons.set(1, <LibraryBooksIcon />)
  icons.set(2, <FindInPageIcon />)

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {icons.get(icon)}
    </div>
  )
}

const getSteps = () => ['Indexed library', 'Query']

const getStepContent = (step: number) => {
  switch (step) {
    case 0:
      return 'Add to your index by uploading documents.'
    case 1:
      return 'Search your documents with natural questions!'
    default:
      return 'Unknown step'
  }
}
const upload = (file: File) => {
  const data = new FormData()
  data.append('file-to-upload', file)

  fetch('/pdf', {
    method: 'POST',
    body: data,
  })
    .then((response) => response.json())
    .then((success) => console.log(success))
    .catch((error) => console.log(error))
}

interface Props extends WithStyles<typeof main> {}

type Answers = { answer: string; score: number }[]
type AnswerResp = { result: Answers }

const CustomizedSteppers = (props: Props) => {
  const history = useHistory()
  const pdfs = usePdf()
  const sd = pdfs.length === 0 ? 0 : 1
  const [files, setFiles] = useState<File[]>()
  const [uploading, setUploading] = useState(false)
  const [activeStep, setActiveStep] = useState(sd)
  const submitRef = useRef({
    getState: () => ({
      isRunning: false,
      error: '',
      errorOpen: false,
      query: '',
      result: '',
    }),
    setState: (state: any) => Promise.resolve(state),
  })

  const { classes } = props

  const steps = getSteps()

  const submitQuery = async (e: any) => {
    e.preventDefault()
    submitRef.current.setState({ isRunning: true })

    if (submitRef.current.getState().query.length <= 2) {
      return submitRef.current.setState({
        error: 'Query seems to be invalid',
        errorOpen: true,
        isRunning: false,
      })
    }

    console.log('submit')
    const body = JSON.stringify({
      query: submitRef.current.getState().query,
    })

    const resp = await fetch('/v1/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }).catch(() => ({
      ok: false,
      statusText: 'Network problem. Please try again.',
      status: null,
      json: () => '',
    }))

    if (!resp.ok && !resp.status)
      return submitRef.current.setState({
        error: resp.statusText,
        errorOpen: true,
        isRunning: false,
      })
    if (!resp.ok && resp.status === 401) history.push('/')
    if (!resp.ok && resp.status !== 401) {
      return submitRef.current.setState({
        error: 'Something went wrong. Please try again.',
        errorOpen: true,
        isRunning: false,
      })
    }

    const { result } = (await resp.json()) as AnswerResp

    console.log(result)
    submitRef.current.setState({ result, isRunning: false })
  }

  const handleNext = async (activeStep: number) => {
    if (activeStep === 0 && files && files.length > 0) {
      console.log('upload')
      handleStart()
      await Promise.all(
        files.map((file: File) => {
          upload(file)
          return actions.addPdf({ fileName: file.name })
        }),
      )
      console.log(pdfs)
      handleFinish()
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleFinish = () => setUploading(false)
  const handleStart = () => setUploading(!uploading)

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
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
        <Typography className={classes.instructions}>
          {getStepContent(activeStep)}
        </Typography>
        {activeStep === 0 ? (
          <DropzoneArea
            getPreviewIcon={handlePdfPreview}
            acceptedFiles={['application/pdf']}
            dropzoneText="Drag & drop your PDFs or click here"
            filesLimit={5}
            showFileNamesInPreview
            maxFileSize={50 * 1e6}
            dropzoneClass={classes.dropzone}
            onChange={(files) => setFiles(files)}
          />
        ) : (
          <Query submitQuery={submitQuery} ref={submitRef} />
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
          {activeStep === 0 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleNext(activeStep)}
              className={classes.button}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => submitQuery(e)}
              className={classes.button}
            >
              Submit
            </Button>
          )}

          <Backdrop
            className={classes.backdrop}
            open={uploading}
            onClick={handleFinish}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </div>
    </>
  )
}

export default withStyles(main)(CustomizedSteppers)
