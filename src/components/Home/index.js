import {Component} from 'react'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FcLike} from 'react-icons/fc'
import {MdShare} from 'react-icons/md'
import {FaRegComment} from 'react-icons/fa'

import {BsHeart} from 'react-icons/bs'

import Header from '../Header'
import SearchContext from '../../context/SearchContext'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

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
    likeStatus: false,
  }

  componentDidMount() {
    this.getStories()
    this.getPosts()
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
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/posts'
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
      }))

      this.setState({
        postsApiStatus: apiStatusConstants.success,
        postsList: updatePosts,
      })
    } else {
      this.setState({postsApiStatus: apiStatusConstants.failure})
    }
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
      infinite: true,
      slidesToScroll: 4,
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
              <p className="userStoryName">{each.userName.slice(0, 5)}</p>
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
        alt="alert"
      />
      <h1>Something went wrong.Please try again</h1>
      <button className="retryButton" onClick={this.retryCalling} type="button">
        Try Again
      </button>
    </div>
  )

  storiesLoadingView = () => (
    <div className="loader-container" data-testid="loader">
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

  onChangeLike = () => {
    this.setState(prevState => ({likeStatus: !prevState.likeStatus}))
  }

  postsSuccessView = () => {
    const {postsList, likeStatus} = this.state

    return (
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
                    //   testid="unLikeIcon"
                  >
                    <FcLike size={17} />
                    {}
                  </button>
                ) : (
                  <button
                    //  testid="likeIcon"
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

  postsFailureView = () => (
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

  postsLoadingView = () => (
    <div className="loader-container">
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
    return (
      <div className="homeContainer">
        <Header />
        <SearchContext.Consumer>
          {value => {
            const {searchViewInitial} = value

            return searchViewInitial ? null : (
              <div>
                <div className="sliderShow">{this.renderStories()}</div>
                <hr className="hr" />
                <div className="renderPostsContainer">{this.renderPosts()}</div>
              </div>
            )
          }}
        </SearchContext.Consumer>
      </div>
    )
  }
}

export default Home
