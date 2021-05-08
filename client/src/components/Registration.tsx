import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { WithStyles } from '@material-ui/core'
import { register } from './styles'
import InputAdornment from '@material-ui/core/InputAdornment'

import CssBaseline from '@material-ui/core/CssBaseline'
import Paper from '@material-ui/core/Paper'
import { FormControl, Input, InputLabel, Button } from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import IconButton from '@material-ui/core/IconButton'
import ErrorIcon from '@material-ui/icons/Error'
import VisibilityTwoToneIcon from '@material-ui/icons/VisibilityTwoTone'
import VisibilityOffTwoToneIcon from '@material-ui/icons/VisibilityOffTwoTone'
import CloseIcon from '@material-ui/icons/Close'
import { Link, useHistory } from 'react-router-dom'

interface Props extends WithStyles<typeof register> {}

const Registration = (props: Props) => {
  const history = useHistory()
  const { classes } = props
  const [state, setState] = useState({
    email: '',
    firstName: '',
    lastName: '',
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

  const submitRegistration = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!passwordMatch()) return setState({ ...state, errorOpen: true, error: 'Passwords do not match' })

    if (state.password.length < 5)
      return setState({ ...state, errorOpen: true, error: 'Password needs to be at least 5 chars long' })

    const body = JSON.stringify({
      email: state.email,
      firstName: state.firstName,
      lastName: state.lastName,
      password: state.password
    })
    const resp = await fetch(`/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }).catch(() => ({ ok: false, statusText: 'Network problem. Please try again.', status: null }))

    if (!resp.ok && !resp.status) return setState({ ...state, error: resp.statusText, errorOpen: true })
    if (!resp.ok && resp.status) return setState({ ...state, error: 'Please check your input', errorOpen: true })

    history.push('/login')
  }

  return (
    <div className={classes.main}>
      <CssBaseline />

      <Paper className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
          <img className={classes.icon} src={avatar} alt="Avatar" />
        </Avatar> */}
        <form className={classes.form} onSubmit={() => submitRegistration}>
          <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="name" className={classes.labels}>
              First name
            </InputLabel>
            <Input
              name="firstName"
              className={classes.inputs}
              disableUnderline={true}
              onChange={handleChange('firstName')}
            />
          </FormControl>
          <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="name" className={classes.labels}>
              Last name
            </InputLabel>
            <Input
              name="lastName"
              className={classes.inputs}
              disableUnderline={true}
              onChange={handleChange('lastName')}
            />
          </FormControl>
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

        <Link className={classes.isMember} to="/login">
          Already a member?
        </Link>

        {state.error ? (
          <Snackbar
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

export default withStyles(register)(Registration)
