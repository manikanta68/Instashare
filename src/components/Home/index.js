import {Component} from 'react'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FcLike} from 'react-icons/fc'
import {BiShareAlt} from 'react-icons/bi'

import {FaRegComment} from 'react-icons/fa'

import {BsHeart} from 'react-icons/bs'

import Header from '../Header'
// import SearchPosts from '../SearchPosts'
// import SearchContext from '../../context/SearchContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    storiesList: [],
    postsApiStatus: apiStatusConstants.initial,
    postsList: [],

    searchKit: '',
    searchViewInitial: false,
    apiLikeStatus: false,
    apiPostId: '',
  }

  componentDidMount() {
    this.getStories()
    this.getPosts()
  }

  postsLike = async () => {
    const {apiLikeStatus, apiPostId, postsList} = this.state
    console.log(apiLikeStatus, apiPostId)
    const url = `https://apis.ccbp.in/insta-share/posts/${apiPostId}/like`
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({like_status: apiLikeStatus}),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log('yemo', data.message)
    const updatePostsList = postsList.map(eachPost => {
      if (eachPost.postId === apiPostId) {
        // console.log(eachPost)

        //  console.log({...eachPost, likesCount: eachPost.likesCount +1})
        if (data.message === 'Post has been liked') {
          // console.log(eachPost)

          return {...eachPost, like: true, likesCount: eachPost.likesCount + 1}
        }
        // console.log({...eachPost, likesCount: eachPost.likesCount - 1})
        // console.log(eachPost)

        return {...eachPost, like: false, likesCount: eachPost.likesCount - 1}
      }
      return eachPost
    })
    // console.log(updatePostsList)
    this.setState({postsList: updatePostsList})
  }

  getStories = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()

      const updateList = data.users_stories.map(each => ({
        storyUrl: each.story_url,
        userId: each.user_id,
        userName: each.user_name,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        storiesList: updateList,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getPosts = async () => {
    this.setState({postsApiStatus: apiStatusConstants.inprogress})
    const {searchKit} = this.state
    const jwtToken = Cookies.get('jwt_token')
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
      console.log(data)
      const updatePosts = data.posts.map(each => ({
        comments: each.comments,
        createdAt: each.created_at,
        likesCount: each.likes_count,
        postDetails: each.post_details,
        postId: each.post_id,
        profilePic: each.profile_pic,
        userId: each.user_id,
        userName: each.user_name,
        like: false,
      }))

      this.setState({
        postsApiStatus: apiStatusConstants.success,
        postsList: updatePosts,
      })
    } else {
      this.setState({postsApiStatus: apiStatusConstants.failure})
    }
  }

  searchKitChange = value => {
    this.setState({searchKit: value})
  }

  SearchViewChange = () => {
    this.setState(
      prevState => ({
        searchViewInitial: !prevState.searchViewInitial,
      }),
      this.getPosts,
    )
  }

  retryCalling = () => {
    this.getStories()
  }

  storiesSuccessView = () => {
    const {storiesList} = this.state

    const settings = {
      dots: false,
      slidesToShow: 4,
      speed: 500,
      infinite: false,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    }

    return (
      <div className="sliderContainer">
        <Slider {...settings}>
          {storiesList.map(each => (
            <div className="userStoryContainer" key={each.userId}>
              <img
                className="userStoryImage"
                src={each.storyUrl}
                alt="user story"
              />
              <p className="userStoryName">{each.userName}</p>
            </div>
          ))}
        </Slider>
      </div>
    )
  }

  storiesFailureView = () => (
    <div className="failureViewContainer">
      <img
        src="https://res.cloudinary.com/djszohdjt/image/upload/v1706552284/alert-triangle_alvbje.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button className="retryButton" onClick={this.retryCalling} type="button">
        Try Again
      </button>
    </div>
  )

  storiesLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderStories = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.storiesSuccessView()
      case apiStatusConstants.failure:
        return this.storiesFailureView()
      case apiStatusConstants.inprogress:
        return this.storiesLoadingView()

      default:
        return null
    }
  }

  retryPostsCalling = () => {
    this.getPosts()
  }

  //   onChangeLike = () => {
  //     this.setState(prevState => ({likeStatus: !prevState.likeStatus}))
  //   }

  postsSuccessView = () => {
    const {postsList, searchViewInitial} = this.state

    if (postsList.length > 0) {
      return (
        <div>
          {searchViewInitial && (
            <h1 className="searchResultsPara">Search Results</h1>
          )}

          <ul className="postsUlListContainer">
            {postsList.map(each => (
              <li className="postListItem" key={each.postId}>
                <div className="postItemsContainer">
                  <div className="profileContainer">
                    <img
                      className="profilePic"
                      src={each.profilePic}
                      alt="post author profile"
                    />
                    <Link to={`/users/${each.userId}`}>
                      <h1 className="profileName">{each.userName}</h1>
                    </Link>
                  </div>
                  <img
                    className="postImage"
                    src={each.postDetails.image_url}
                    alt="post"
                  />
                  <div className="likesContainer">
                    <button
                      onClick={() => {
                        if (each.like === false) {
                          this.setState(
                            {
                              apiLikeStatus: true,
                              apiPostId: each.postId,
                            },
                            this.postsLike,
                          )
                        } else {
                          this.setState(
                            {
                              apiLikeStatus: false,
                              apiPostId: each.postId,
                            },
                            this.postsLike,
                          )
                        }
                      }}
                      className="likeButton"
                      type="button"
                      testid={each.like ? 'unLikeIcon' : 'likeIcon'}
                    >
                      {' '}
                      {each.like ? <FcLike size={17} /> : <BsHeart size={17} />}
                      {}
                    </button>

                    <FaRegComment className="comment" />
                    <BiShareAlt className="share" />
                  </div>

                  <p className="likes">{each.likesCount} likes</p>

                  <p className="likes">{each.postDetails.caption}</p>
                  <ul className="commentsContainer">
                    {each.comments.map(comment => (
                      <li key={comment.user_id}>
                        <p className="commentsDescription">
                          <span className="commentSpan">
                            {comment.user_name}
                          </span>{' '}
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
        </div>
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

  postsFailureView = () => (
    <div className="failureViewContainer">
      <img
        src="https://res.cloudinary.com/djszohdjt/image/upload/v1706552284/alert-triangle_alvbje.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button
        className="retryButton"
        onClick={this.retryPostsCalling}
        type="button"
      >
        Try again
      </button>
    </div>
  )

  postsLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderPosts = () => {
    const {postsApiStatus} = this.state
    switch (postsApiStatus) {
      case apiStatusConstants.success:
        return this.postsSuccessView()
      case apiStatusConstants.failure:
        return this.postsFailureView()
      case apiStatusConstants.inprogress:
        return this.postsLoadingView()

      default:
        return null
    }
  }

  render() {
    const {searchViewInitial, searchKit} = this.state
    return (
      <div className="homeContainer">
        <Header
          searchKitChange={this.searchKitChange}
          SearchViewChange={this.SearchViewChange}
          searchKitValue={searchKit}
        />

        {searchViewInitial ? null : (
          <div>
            <div className="sliderShow">{this.renderStories()}</div>
            <hr className="hr" />
          </div>
        )}

        <div className="renderPostsContainer">{this.renderPosts()}</div>
      </div>
    )
  }
}

export default Home
