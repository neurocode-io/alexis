import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './components/Login'
import Registration from './components/Registration'
import Main from './components/Main'

const App = () => (
  <div className="App">
    <Router>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Registration} />
        <Route exact path="/app" component={Main} />
      </Switch>
    </Router>
  </div>
)

export default App
