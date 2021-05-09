import { withStyles } from '@material-ui/core/styles'
import { WithStyles, FormControl, Input, InputLabel } from '@material-ui/core'
import { main } from './styles'

interface Props extends WithStyles<typeof main> {}

const Query = (props: Props) => {
  const { classes } = props

  const submitQuery = async (e: any) => {
    e.preventDefault()
    console.log('submit')
    const body = JSON.stringify({
      query: 'asd'
    })

    const resp = await fetch('/v1/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }).catch(() => ({ ok: false, statusText: 'Network problem. Please try again.', status: null }))

    console.log(resp)
  }

  return (
    <form className={classes.form} onSubmit={submitQuery}>
      <FormControl required fullWidth margin="normal">
        <InputLabel htmlFor="query" className={classes.labels}>
          query
        </InputLabel>
        <Input
          name="query"
          type="query"
          className={classes.inputs}
          style={{ width: '400px' }}
          disableUnderline={true}
          onChange={() => console.log('sd')}
        />
      </FormControl>
    </form>
  )
}

export default withStyles(main)(Query)
