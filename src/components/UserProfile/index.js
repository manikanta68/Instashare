import {Component} from 'react'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'

import Header from '../Header'

// import SearchContext from '../../context/SearchContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

class UserProfile extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    userData: {},
  }

  componentDidMount() {
    this.getUserProfile()
  }

  getUserProfile = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const userDetails = data.user_details
      const updateUserData = {
        followersCount: userDetails.followers_count,
        followingCount: userDetails.following_count,
        id: userDetails.id,
        posts: userDetails.posts,
        postsCount: userDetails.posts_count,
        profilePic: userDetails.profile_pic,
        stories: userDetails.stories,
        userBio: userDetails.user_bio,
        userId: userDetails.user_id,
        userName: userDetails.user_name,
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        userData: updateUserData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  retryCalling = () => {
    this.getUserProfile()
  }

  userProfileSuccessView = () => {
    const {userData} = this.state
    console.log(userData)
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
      <div>
        <div className="userInfoAndSliderContainer">
          <div className="userInfoContainerForDesktop">
            <img
              className="userProfilePicDesktop"
              src={userData.profilePic}
              alt="user profile"
            />
            <div>
              <h1 className="userNameDesktop">{userData.userName}</h1>
              <div className="userFollowersFollowingContainer">
                <div className="countContainer">
                  <div className="postCountContainerDesktop">
                    <p className="postsCountDesktop">{userData.postsCount}</p>
                    <p className="postsCountDesktop">posts</p>
                  </div>
                  <div className="postCountContainerDesktop">
                    <p className="postsCountDesktop">
                      {userData.followersCount}
                    </p>
                    <p className="postsCountDesktop">followers</p>
                  </div>
                  <div className="postCountContainerDesktop">
                    <p className="postsCountDesktop">
                      {userData.followingCount}
                    </p>
                    <p className="postsCountDesktop">following</p>
                  </div>
                </div>
              </div>
              <p className="userIdDesktop">{userData.userId}</p>
              <p className="userBioDesktop">{userData.userBio}</p>
            </div>
          </div>

          <ul className="UserProfileSliderContainer">
            <Slider {...settings}>
              {userData.stories.map(each => (
                <li className="userStoryContainer" key={each.id}>
                  <img
                    className="userStoryImage"
                    src={each.image}
                    alt="user story"
                  />
                </li>
              ))}
            </Slider>
          </ul>
        </div>
        <hr className="hr" />
        <div className="userPostsContainer">
          <div className="postsGridContainer">
            <BsGrid3X3 size={20} />
            <h1 className="postsGridName">Posts</h1>
          </div>
          {userData.posts.length > 0 ? (
            <ul className="userPostsUlListContainer">
              {userData.posts.map(each => (
                <li key={each.id}>
                  <img
                    className="userPostImage"
                    src={each.image}
                    alt="user post"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="noPostsContainer">
              <div className="cameraIconContainer">
                <BiCamera size={25} />
              </div>
              <h1>No Posts</h1>
            </div>
          )}
        </div>
      </div>
    )
  }

  userProfileFailureView = () => (
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

  userProfileLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderUserProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.userProfileSuccessView()
      case apiStatusConstants.failure:
        return this.userProfileFailureView()
      case apiStatusConstants.inprogress:
        return this.userProfileLoadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="userProfileContainer">
        <Header />

        <div className="sliderShow">{this.renderUserProfile()}</div>
      </div>
    )
  }
}

export default UserProfile
