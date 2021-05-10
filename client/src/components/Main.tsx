import { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { WithStyles, Box } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import CssBaseline from '@material-ui/core/CssBaseline'
import { main } from './styles'
import { useHistory } from 'react-router'

import Stepper from './Stepper'

interface Props extends WithStyles<typeof main> {}

type User = {
  firstName: string
  lastName: string
  email: string
  pdfs: { id: string; fileName: string }[]
}

type UserResp = { result: User }

const CustomizedSteppers = (props: Props) => {
  const history = useHistory()
  const [state, setState] = useState<{
    name: string
    files?: File[]
    pdfs?: { id: string; fileName: string }[]
  }>({
    name: '',
  })

  useEffect(() => {
    const getMe = async () => {
      const resp = await fetch('/v1/me')
      const { result: me } = (await resp.json()) as UserResp

      console.log(me)
      setState({
        ...state,
        pdfs: me.pdfs.filter(({ id }) => id),
        name: `${me.firstName} ${me.lastName}`,
      })

      if (!me.email) history.push('/login')
    }
    getMe().catch(() => history.push('/login'))
  }, [history])

  const getKnowledgeSource = () => {
    if (state.pdfs?.length === 0) {
      return <p>Start by adding to your knowledge source!</p>
    } else {
      return [
        <h3>Your knowledge source database consists of:</h3>,
        <ul>
          {state.pdfs?.map((pdf) => (
            <li>{pdf.fileName}</li>
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
        <h3>Hello {state.name}</h3>
        {getKnowledgeSource()}
        <div className={classes.paperContainer}>
          <Stepper />
        </div>
      </Paper>
    </div>
  )
}

export default withStyles(main)(CustomizedSteppers)
