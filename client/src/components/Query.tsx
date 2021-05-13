import { withStyles } from '@material-ui/core/styles'
import {
  WithStyles,
  FormControl,
  Input,
  InputLabel,
  Container,
} from '@material-ui/core'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { main } from './styles'
import { forwardRef, useImperativeHandle, useState } from 'react'
import ErrorIcon from '@material-ui/icons/Error'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

interface Props extends WithStyles<typeof main> {
  submitQuery: (e: any) => Promise<void>
}

type Answers = { answer: string; score: number }[]

type State = {
  isRunning: boolean
  error?: string
  errorOpen?: boolean
  query?: string
  result?: Answers
}

const Query = forwardRef((props: Props, ref) => {
  const [state, setState] = useState<State>({ isRunning: false })
  const { classes, submitQuery } = props

  const handleFinish = () => setState({ ...state, isRunning: false })
  const errorClose = () => setState({ ...state, errorOpen: false })

  useImperativeHandle(ref, () => ({
    getState: () => state,
    setState: (newState: State) => setState({ ...state, ...newState }),
  }))

  return (
    <>
      <form className={classes.form} autoComplete="off" onSubmit={submitQuery}>
        <FormControl required fullWidth margin="normal">
          <InputLabel htmlFor="query" className={classes.labels}>
            query
          </InputLabel>
          <Input
            multiline
            rows={3}
            rowsMax={3}
            name="query"
            type="text"
            className={classes.inputs}
            style={{ width: '400px' }}
            disableUnderline={true}
            onChange={(e) => setState({ ...state, query: e.target.value })}
          />
        </FormControl>
      </form>

      <Container maxWidth="xs">
        <h3 hidden={state.result === undefined}>Results</h3>
        {state.result?.map(({ score, answer }) => (
          <p key={score}>
            Answer: {answer} <br />
            Score: {score}
          </p>
        ))}
      </Container>
      <Backdrop
        className={classes.backdrop}
        open={state.isRunning}
        onClick={handleFinish}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {state.error ? (
        <Snackbar
          key={state.error}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={state.errorOpen}
          onClose={errorClose}
          autoHideDuration={3000}
        >
          <SnackbarContent
            className={classes.error}
            message={
              <div>
                <span style={{ marginRight: '8px' }}>
                  <ErrorIcon fontSize="large" color="error" />
                </span>
                <span> {state.error} </span>
              </div>
            }
            action={[
              <IconButton key="close" aria-label="close" onClick={errorClose}>
                <CloseIcon color="error" />
              </IconButton>,
            ]}
          />
        </Snackbar>
      ) : null}
    </>
  )
})

export default withStyles(main)(Query)
