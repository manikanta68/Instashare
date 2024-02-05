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
  state = {
    menu: false,
    searchBar: false,
  }

  onChangeMenu = () => {
    this.setState(prevState => ({menu: !prevState.menu, searchBar: false}))
  }

  onChangeSearch = () => {
    this.setState({menu: false, searchBar: true})
  }

  render() {
    const {menu, searchBar} = this.state

    return (
      <SearchContext.Provider
        value={{
          menu,
          searchBar,

          onChangeMenu: this.onChangeMenu,
          onChangeSearch: this.onChangeSearch,
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
