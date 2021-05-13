import { useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { WithStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import CssBaseline from '@material-ui/core/CssBaseline'
import { main } from './styles'
import { useHistory } from 'react-router'

import { actions, usePdf, useUser, User } from '../store'
import Stepper from './Stepper'

interface Props extends WithStyles<typeof main> {}

type UserResp = { result: User }

const CustomizedSteppers = (props: Props) => {
  const history = useHistory()
  const user = useUser()
  const pdfs = usePdf()

  useEffect(() => {
    const getMe = async () => {
      const resp = await fetch('/v1/me')
      const { result: me } = (await resp.json()) as UserResp

      if (!me.email) history.push('/login')

      actions.addUser(me)
    }
    getMe().catch(() => history.push('/login'))
  }, [history])

  const getIndexedLibrary = () => {
    if (pdfs.length === 0) {
      return <p>Start by adding documents to your library!</p>
    } else {
      return [
        <span>Your indexed library consists of:</span>,
        <ul>
          {pdfs.map((pdf) => (
            <li key={pdf.fileName}>{pdf.fileName}</li>
          ))}
        </ul>,
      ].flat()
    }
  }

  const { classes } = props

  return (
    <div className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <h3>Hello {user}</h3>
        {getIndexedLibrary()}
        <div className={classes.paperContainer}>
          <Stepper />
        </div>
      </Paper>
    </div>
  )
}

export default withStyles(main)(CustomizedSteppers)
