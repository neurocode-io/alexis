import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { WithStyles } from '@material-ui/core'
import { main } from './styles'
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

interface Props extends WithStyles<typeof main> {}

const Login = (props: Props) => {
  const history = useHistory()
  const { classes } = props
  const [state, setState] = useState({
    email: '',
    password: '',
    hidePassword: true,
    error: '',
    errorOpen: false
  })

  const errorClose = () => setState({ ...state, errorOpen: false })
  const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setState({ ...state, [name]: e.target.value })
  const showPassword = () => setState((state) => ({ ...state, hidePassword: !state.hidePassword }))

  const isValid = () => (state.email === '' ? false : true)
  const submitLogin = async (e: React.MouseEvent) => {
    e.preventDefault()

    const body = JSON.stringify({
      email: state.email,
      password: state.password
    })
    const resp = await fetch('/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }).catch(() => ({ ok: false, statusText: 'Network problem. Please try again.', status: null }))

    if (!resp.ok && !resp.status) return setState({ ...state, error: resp.statusText, errorOpen: true })
    if (!resp.ok && resp.status) return setState({ ...state, error: 'Please check your input', errorOpen: true })

    history.push('/app')
  }

  return (
    <div className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <form className={classes.form} onSubmit={() => submitLogin}>
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
          <Button
            component="button"
            disabled={!isValid()}
            disableFocusRipple
            fullWidth
            variant="outlined"
            className={classes.button}
            type="submit"
            onClick={submitLogin}
          >
            Login
          </Button>
        </form>

        <Link className={classes.isMember} to="/register">
          Not a member yet?
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
            autoHideDuration={2000}
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

export default withStyles(main)(Login)
