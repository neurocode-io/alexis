//@ts-check
//@ts-ignore
import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { WithStyles } from '@material-ui/core'
import { register } from './styles'
import InputAdornment from '@material-ui/core/InputAdornment'

import CssBaseline from '@material-ui/core/CssBaseline'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import { FormControl, Input, InputLabel, Button } from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import IconButton from '@material-ui/core/IconButton'
import ErrorIcon from '@material-ui/icons/Error'
import VisibilityTwoToneIcon from '@material-ui/icons/VisibilityTwoTone'
import VisibilityOffTwoToneIcon from '@material-ui/icons/VisibilityOffTwoTone'
import CloseIcon from '@material-ui/icons/Close'
import avatar from './avatar.png'

interface Props extends WithStyles<typeof register> {}

const Registration = (props: Props) => {
  const { classes } = props
  const [state, setState] = useState({
    email: '',
    password: '',
    passwordConfrim: '',
    hidePassword: true,
    error: '',
    errorOpen: false
  })

  const errorClose = () => setState({ ...state, errorOpen: false })
  const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setState({ ...state, [name]: e.target.value })
  const passwordMatch = () => state.password === state.passwordConfrim
  const showPassword = () => setState((state) => ({ ...state, hidePassword: !state.hidePassword }))

  const isValid = () => (state.email === '' ? false : true)
  const submitRegistration = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!passwordMatch()) {
      setState({ ...state, errorOpen: true, error: 'Passwords do not match' })
    }
    // send to backend
  }

  return (
    <div className={classes.main}>
      <CssBaseline />

      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <img className={classes.icon} src={avatar} alt="Avatar" />
        </Avatar>
        <form className={classes.form} onSubmit={() => submitRegistration}>
          <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="email" className={classes.labels}>
              e-mail
            </InputLabel>
            <Input
              name="email"
              type="email"
              autoComplete="email"
              className={classes.inputs}
              disableUnderline={true}
              onChange={handleChange('email')}
            />
          </FormControl>

          <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="password" className={classes.labels}>
              password
            </InputLabel>
            <Input
              name="password"
              autoComplete="password"
              className={classes.inputs}
              disableUnderline={true}
              onChange={handleChange('password')}
              type={state.hidePassword ? 'password' : 'input'}
              endAdornment={
                state.hidePassword ? (
                  <InputAdornment position="end">
                    <VisibilityOffTwoToneIcon
                      fontSize="default"
                      className={classes.passwordEye}
                      onClick={() => showPassword()}
                    />
                  </InputAdornment>
                ) : (
                  <InputAdornment position="end">
                    <VisibilityTwoToneIcon
                      fontSize="default"
                      className={classes.passwordEye}
                      onClick={() => showPassword()}
                    />
                  </InputAdornment>
                )
              }
            />
          </FormControl>

          <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="passwordConfrim" className={classes.labels}>
              confrim password
            </InputLabel>
            <Input
              name="passwordConfrim"
              autoComplete="passwordConfrim"
              className={classes.inputs}
              disableUnderline={true}
              onClick={showPassword}
              onChange={handleChange('passwordConfrim')}
              type={state.hidePassword ? 'password' : 'input'}
              endAdornment={
                state.hidePassword ? (
                  <InputAdornment position="end">
                    <VisibilityOffTwoToneIcon
                      fontSize="default"
                      className={classes.passwordEye}
                      onClick={() => showPassword()}
                    />
                  </InputAdornment>
                ) : (
                  <InputAdornment position="end">
                    <VisibilityTwoToneIcon
                      fontSize="default"
                      className={classes.passwordEye}
                      onClick={() => showPassword()}
                    />
                  </InputAdornment>
                )
              }
            />
          </FormControl>
          <Button
            component="button"
            disabled={!isValid()}
            disableFocusRipple
            fullWidth
            variant="outlined"
            className={classes.button}
            type="submit"
            onClick={submitRegistration}
          >
            Join
          </Button>
        </form>

        {state.error ? (
          <Snackbar
            // variant=""
            key={state.error}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
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
                </IconButton>
              ]}
            />
          </Snackbar>
        ) : null}
      </Paper>
    </div>
  )
}
// class Registration extends Component<Props> {
//   state = {
//     email: '',
//     password: '',
//     passwordConfrim: '',
//     hidePassword: true,
//     error: null,
//     errorOpen: false
//   }

//   }
// }

export default withStyles(register)(Registration)
