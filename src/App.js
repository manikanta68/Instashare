import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import UserProfile from './components/UserProfile'
import ProtectedRoute from './components/ProtectedRoute'
import MyProfile from './components/MyProfile'
import NotFound from './components/NotFound'
import SearchContext from './context/SearchContext'

import './App.css'

class App extends Component {
  state = {searchViewInitial: false}

  SearchViewChange = () => {
    console.log('ok')
    this.setState(prevState => ({
      searchViewInitial: !prevState.searchViewInitial,
    }))
  }

  render() {
    const {searchViewInitial} = this.state
    console.log(searchViewInitial)
    return (
      <SearchContext.Provider
        value={{
          searchViewInitial,
          SearchViewChange: this.SearchViewChange,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/users/:id" component={UserProfile} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </SearchContext.Provider>
    )
  }
}

export default App
