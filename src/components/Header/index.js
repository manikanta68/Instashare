import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {MdMenu, MdShare} from 'react-icons/md'
import {FaSearch, FaRegComment} from 'react-icons/fa'

import {AiFillCloseCircle} from 'react-icons/ai'

import Loader from 'react-loader-spinner'
import {FcLike} from 'react-icons/fc'

import {BsHeart} from 'react-icons/bs'
import SearchContext from '../../context/SearchContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

class Header extends Component {
  state = {
    menu: false,
    searchBar: false,
    searchedApiStatus: apiStatusConstants.initial,
    searchedPostsList: [],
    searchKit: '',
    searchView: false,
  }

  componentDidMount() {
    this.getSearchedPosts()
  }

  getSearchedPosts = async () => {
    this.setState({searchedApiStatus: apiStatusConstants.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchKit} = this.state
    console.log(`hi ${searchKit}`)

    const url = `https://apis.ccbp.in/insta-share/posts?search=${searchKit}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatePosts = data.posts.map(each => ({
        comments: each.comments,
        createdAt: each.created_at,
        likesCount: each.likes_count,
        postDetails: each.post_details,
        postId: each.post_id,
        profilePic: each.profile_pic,
        userId: each.user_id,
        userName: each.user_name,
      }))

      this.setState({
        searchedApiStatus: apiStatusConstants.success,
        searchedPostsList: updatePosts,
      })
    } else {
      this.setState({searchedApiStatus: apiStatusConstants.failure})
    }
  }

  SearchedPostsSuccessView = () => {
    const {searchedPostsList, likeStatus} = this.state

    console.log(searchedPostsList)

    if (searchedPostsList.length > 0) {
      return (
        <ul className="postsUlListContainer">
          {searchedPostsList.map(each => (
            <li className="postListItem" key={each.postId}>
              <div className="postItemsContainer">
                <div className="profileContainer">
                  <img
                    className="profilePic"
                    src={each.profilePic}
                    alt="post author profile"
                  />
                  <Link to={`users/${each.userId}`}>
                    <h1 className="profileName">{each.userName}</h1>
                  </Link>
                </div>
                <img
                  className="postImage"
                  src={each.postDetails.image_url}
                  alt="post"
                />
                <div className="likesContainer">
                  {likeStatus ? (
                    <button
                      onClick={this.onChangeLike}
                      className="likeButton"
                      type="button"
                    >
                      <FcLike size={17} />
                      {}
                    </button>
                  ) : (
                    <button
                      onClick={this.onChangeLike}
                      className="likeButton"
                      type="button"
                    >
                      <BsHeart size={17} />
                      {}
                    </button>
                  )}

                  <FaRegComment className="comment" />
                  <MdShare className="share" />
                </div>
                <p className="likes">{each.likesCount} likes</p>
                <p className="likes">{each.postDetails.caption}</p>
                <ul className="commentsContainer">
                  {each.comments.map(comment => (
                    <li key={comment.user_id}>
                      <p className="commentsDescription">
                        <span className="commentSpan">{comment.user_name}</span>{' '}
                        {comment.comment}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="likes">{each.createdAt}</p>
              </div>
            </li>
          ))}
        </ul>
      )
    }
    return (
      <div className="failureViewContainer">
        <img
          className="searchNotFoundImage"
          src="https://res.cloudinary.com/djszohdjt/image/upload/v1706887315/Group_lestmc.png"
          alt="search not found"
        />
        <h1>Search Not Found</h1>
        <p>Try different keyword or search again</p>
      </div>
    )
  }

  SearchedPostsFailureView = () => (
    <div className="failureViewContainer">
      <img
        src="https://res.cloudinary.com/djszohdjt/image/upload/v1706552284/alert-triangle_alvbje.png"
        alt="alert"
      />
      <h1>Something went wrong.Please try again</h1>
      <button
        className="retryButton"
        onClick={this.retryPostsCalling}
        type="button"
      >
        Try Again
      </button>
    </div>
  )

  SearchedPostsLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderSearedPosts = () => {
    const {searchedApiStatus} = this.state

    switch (searchedApiStatus) {
      case apiStatusConstants.success:
        return this.SearchedPostsSuccessView()
      case apiStatusConstants.failure:
        return this.SearchedPostsFailureView()
      case apiStatusConstants.inprogress:
        return this.SearchedPostsLoadingView()

      default:
        return null
    }
  }

  onChangeMenu = () => {
    this.setState(prevState => ({menu: !prevState.menu, searchBar: false}))
  }

  Logout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onChangeSearch = () => {
    this.setState({menu: false, searchBar: true})
  }

  onChangeSearchInputFunction = event => {
    this.setState({searchKit: event.target.value})
  }

  render() {
    const {menu, searchBar, searchView, searchKit} = this.state
    return (
      <SearchContext.Consumer>
        {value => {
          const {SearchViewChange} = value
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
                      <p className="navInstaShareHeading">Insta Share</p>
                    </div>
                    <button
                      onClick={this.onChangeMenu}
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
                            onClick={this.onChangeSearch}
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
                            onClick={this.onChangeMenu}
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
                          value={searchKit}
                          onChange={this.onChangeSearchInputFunction}
                          className="searchInput"
                          type="search"
                        />
                        <button
                          onClick={() => {
                            this.setState(
                              prevState => ({
                                searchView: !prevState.searchView,
                              }),
                              this.getSearchedPosts,
                            )
                            SearchViewChange()
                          }}
                          className="searchButtonIcon"
                          type="button"
                          //  testid="searchIcon"
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
                    <p className="navInstaShareHeading">Insta Share</p>
                  </div>

                  <div className="menusItems">
                    <div className="desktopSearchBar">
                      {' '}
                      <input
                        value={searchKit}
                        onChange={this.onChangeSearchInputFunction}
                        className="searchInput"
                        type="search"
                      />
                      <button
                        // testid="searchIcon"
                        className="searchButtonIcon"
                        type="button"
                        onClick={() => {
                          this.setState(
                            prevState => ({searchView: !prevState.searchView}),
                            this.getSearchedPosts,
                          )
                          SearchViewChange()
                        }}
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
              <div> {searchView && this.renderSearedPosts()}</div>
            </div>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}
export default withRouter(Header)
