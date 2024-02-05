import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {MdMenu} from 'react-icons/md'
import {FaSearch} from 'react-icons/fa'

import {AiFillCloseCircle} from 'react-icons/ai'

import SearchContext from '../../context/SearchContext'

import './index.css'

class Header extends Component {
  Logout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    const {searchKitChange, searchKitValue, SearchViewChange} = this.props
    return (
      <SearchContext.Consumer>
        {value => {
          const {menu, searchBar, onChangeMenu, onChangeSearch} = value

          const onChangeSearchInputFunction = event => {
            searchKitChange(event.target.value)
          }

          const menuChange = () => {
            onChangeMenu()
          }

          const changeSearch = () => {
            onChangeSearch()
          }

          const changeSearchView = () => {
            SearchViewChange()
          }

          return (
            <div>
              <nav className="navbar">
                <div className="mobileViewNav">
                  <div className="navInstaShareLogoMobileContainer">
                    <div className="navInstaShareLogoContainer">
                      <Link to="/">
                        <img
                          className="navWebsiteLogoMV"
                          src="https://res.cloudinary.com/djszohdjt/image/upload/v1706456287/Standard_Collection_8_1_grqqec.png"
                          alt="website logo"
                        />
                      </Link>
                      <h1 className="navInstaShareHeading">Insta Share</h1>
                    </div>
                    <button
                      onClick={menuChange}
                      className="menuButton"
                      type="button"
                    >
                      {}
                      <MdMenu size={20} />
                    </button>
                  </div>

                  <div>
                    {menu && (
                      <ul className="humMenu">
                        <Link className="link" to="/">
                          <li className="humItem">
                            <p className="humItemContent">Home</p>
                          </li>
                        </Link>

                        <li className="humItem">
                          <button
                            onClick={changeSearch}
                            type="button"
                            className="searchButton"
                          >
                            {' '}
                            Search
                          </button>
                        </li>
                        <Link className="link" to="/my-profile">
                          <li className="humItem">
                            <p className="humItemContent">Profile</p>
                          </li>
                        </Link>
                        <li className="humItem">
                          <button
                            onClick={this.Logout}
                            className="logoutButton"
                            type="button"
                          >
                            Logout
                          </button>
                        </li>
                        <li className="humItem">
                          <button
                            onClick={menuChange}
                            className="menuButton"
                            type="button"
                          >
                            {}
                            <AiFillCloseCircle size={20} />
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                  <div className="searchBarContainer">
                    {searchBar && (
                      <div className="searchBar">
                        {' '}
                        <input
                          value={searchKitValue}
                          onChange={onChangeSearchInputFunction}
                          className="searchInput"
                          type="search"
                          placeholder="Search caption"
                        />
                        <button
                          onClick={changeSearchView}
                          className="searchButtonIcon"
                          type="button"
                          testid="searchIcon"
                        >
                          {}
                          <FaSearch />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="navDesktopView">
                  <div className="navInstaShareLogoContainer">
                    <Link to="/">
                      <img
                        className="navWebsiteLogoMV"
                        src="https://res.cloudinary.com/djszohdjt/image/upload/v1706456287/Standard_Collection_8_1_grqqec.png"
                        alt="website logo"
                      />
                    </Link>
                    <h1 className="navInstaShareHeading">Insta Share</h1>
                  </div>

                  <div className="menusItems">
                    <div className="desktopSearchBar">
                      {' '}
                      <input
                        placeholder="Search caption"
                        value={searchKitValue}
                        onChange={onChangeSearchInputFunction}
                        className="searchInput"
                        type="search"
                      />
                      <button
                        testid="searchIcon"
                        className="searchButtonIcon"
                        type="button"
                        onClick={changeSearchView}
                      >
                        {}
                        <FaSearch />
                      </button>
                    </div>
                    <ul className="humMenu">
                      <Link className="link" to="/">
                        <li className="humItem">
                          <p className="humItemContent">Home</p>
                        </li>
                      </Link>

                      <Link className="link" to="/my-profile">
                        <li className="humItem">
                          <p className="humItemContent">Profile</p>
                        </li>
                      </Link>
                      <li className="humItem">
                        <button
                          onClick={this.Logout}
                          className="largeLogoutButton"
                          type="button"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}
export default withRouter(Header)
