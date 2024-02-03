import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import UserProfile from './components/UserProfile'
import ProtectedRoute from './components/ProtectedRoute'
import MyProfile from './components/MyProfile'
import SearchPosts from './components/SearchPosts'
import NotFound from './components/NotFound'

import SearchContext from './context/SearchContext'

import './App.css'

class App extends Component {
  state = {
    searchViewInitial: false,
    searchKit: '',
    menu: false,
    searchBar: false,
  }

  onChangeMenu = () => {
    this.setState(prevState => ({menu: !prevState.menu, searchBar: false}))
  }

  onChangeSearch = () => {
    this.setState({menu: false, searchBar: true})
  }

  SearchViewChange = () => {
    console.log('ok')
    this.setState(prevState => ({
      searchViewInitial: !prevState.searchViewInitial,
    }))
  }

  searchKitChange = value => {
    this.setState({searchKit: value})
  }

  render() {
    const {searchViewInitial, searchKit, menu, searchBar} = this.state
    console.log(searchViewInitial, searchKit)
    return (
      <SearchContext.Provider
        value={{
          menu,
          searchBar,
          searchKit,
          searchViewInitial,
          onChangeMenu: this.onChangeMenu,
          onChangeSearch: this.onChangeSearch,
          SearchViewChange: this.SearchViewChange,
          searchKitChange: this.searchKitChange,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/users/:id" component={UserProfile} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <ProtectedRoute exact path="/SearchPosts" component={SearchPosts} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </SearchContext.Provider>
    )
  }
}

export default App
