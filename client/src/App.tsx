import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './components/Login'
import Registration from './components/Registration'
import Stepper from './components/Stepper'

const App = () => (
  <div className="App">
    <Router>
      <Switch>
        <Route exact path="/" component={Registration} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/app" component={Stepper} />
      </Switch>
    </Router>
  </div>
)

export default App
