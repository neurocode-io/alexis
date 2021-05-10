import { red } from '@material-ui/core/colors'
import { createStyles, Theme } from '@material-ui/core'

const orange = '#F2A74B'
const textLight = '#eaf2f4'
const textDark = '#0D0D0D'
const borderLight = 'rgba(206,212,218, .993)'

export const main = (theme: Theme) =>
  createStyles({
    dropzone: {
      backgroundColor: 'transparent',
      maxWidth: '600px',
    },
    main: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(4),
      marginRight: theme.spacing(3),
      marginLeft: theme.spacing(3),
      display: 'block',
      width: 'auto',
      [theme.breakpoints.up(1200)]: {
        width: 1200,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    me: {
      display: 'flex',
      justifyContent: 'right',
      textAlign: 'right',
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    paper: {
      marginTop: theme.spacing(2),
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
      background:
        'linear-gradient(180deg, rgba(169,198,217,1) 15%, rgba(242,167,75,1) 90%)',
      boxShadow: '.2px 12px 18px rgba(131,153,167,0.6)',
    },
    paperContainer: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    avatar: {
      marginTop: 20,
      position: 'relative',
      background: 'rgba(255,255,255,0.85)',
      width: '100px',
      height: '100px',
      boxShadow: '0px 0px 12px rgba(131,153,167,0.99)',
    },

    icon: {
      width: '80px',
      height: '80px',
      color: 'rgba(131,153,167,0.79)',
    },

    form: {
      margin: theme.spacing(4),
      maxWidth: 400,
    },
    labels: {
      padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
      fontSize: '10px',
      lineHeight: '5px',
      fontFamily: 'PT Mono, monospace',
      fontWeight: 300,
      opacity: 0.45,
      color: `${textDark} !important`,
    },

    inputs: {
      position: 'relative',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      fontFamily: 'Cutive Mono, monospace',
      color: textDark,
      fontSize: '14px',
      padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
      borderRadius: '8px',
      border: '1.4px solid',
      boxShadow: '1px 2px 20px rgba(169,198,217,0.29457423) ',
      borderColor: borderLight,

      '&:hover': {
        background: 'rgba(169,198,217,0.36457423) ',
      },
    },

    button: {
      color: textDark,
      background: 'rgba(255,255,255,.45)',
      position: 'relative',
      fontWeight: 400,
      fontFamily: 'Raleway, sans-serif',
      overflow: 'hidden',
      marginTop: theme.spacing(6),
      padding: `${theme.spacing(1.6)}px`,
      border: 'none',
      borderRadius: '8px',
      letterSpacing: '3px',

      '&::before, &::after': {
        position: 'absolute',
        content: '""',
        boxSizing: 'border-box',
        borderRadius: '8px',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 1,
      },
      '&::before': {
        borderBottom: '2px solid rgba(255,255,255,.58)',
        borderTop: '2px solid rgba(255,255,255,.58)',
        transform: 'scale(0,1)',
      },
      '&::after': {
        borderLeft: '3px solid rgba(255,255,255,.58)',
        borderRight: '3px solid rgba(255,255,255,.58)',
        transform: 'scale(1,0)',
      },
      '&:hover::before': {
        transform: 'scale(1,1)',
        transition: 'transform cubic-bezier(0.85,.36,.8,.42) 0.3s',
      },
      '&:hover::after': {
        transform: 'scale(1,1)',
        transition: 'transform cubic-bezier(0.85,.36,.8,.42) .2s',
      },
      '&::first-letter': {
        color: orange,
      },
      '&:hover': {
        background: 'rgba(169,198,217,0.8)',
        color: textLight,
      },
    },
    results: {
      maxWidth: '600px',
    },
    error: {
      border: `1.2px solid ${red[900]}`,
      background: 'rgba(169,198,217,0.29457423)',
      color: red[900],
      fontSize: '14px',
      fontWeight: 400,
      fontFamily: 'Raleway, sans-serif',
      display: 'flex',
      alignItems: 'center',
      paddingBottom: theme.spacing(3),
    },

    passwordEye: {
      color: 'rgba(131,153,167,0.9)',
      opacity: 0.7,
    },

    isMember: {
      marginTop: '10px',
      color: textDark,
    },
  })
