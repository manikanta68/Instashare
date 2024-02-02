import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="notFoundContainer">
    <img
      src="https://res.cloudinary.com/djszohdjt/image/upload/v1706798872/erroring_1_lsyfpl.png"
      alt="page not found"
      className="notFoundImage"
    />
    <h1>PAGE NOT FOUND</h1>
    <p>we are sorry, the page you requested could not be found</p>
    <Link to="/">
      <button className="homePageButton" type="button">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound
