import { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { WithStyles } from '@material-ui/core'

import Paper from '@material-ui/core/Paper'
import CssBaseline from '@material-ui/core/CssBaseline'
import { main } from './styles'
import { useHistory } from 'react-router'

import Stepper from './Stepper'

interface Props extends WithStyles<typeof main> {}

const CustomizedSteppers = (props: Props) => {
  const history = useHistory()
  const [state, setState] = useState<{ name: string; files?: File[]; pdfs?: { id: string; fileName: string }[] }>({
    name: ''
  })

  useEffect(() => {
    const getMe = async () => {
      const resp = await fetch('/v1/me')
      const me = await resp.json()

      console.log(me)
      setState({ ...state, pdfs: me.pdfs })

      if (!me.email) history.push('/login')
    }
    getMe().catch(() => history.push('/login'))
  }, [history])

  const { classes } = props

  return (
    <div className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <Stepper />
      </Paper>
    </div>
  )
}

export default withStyles(main)(CustomizedSteppers)
