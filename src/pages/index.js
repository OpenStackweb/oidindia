import { navigate } from "gatsby"
import { connect } from 'react-redux'

const IndexPage = ({location, isLoggedUser}) => {
  if (location.pathname === `/` && !isLoggedUser) {
    navigate("/auth");        
    return null
  } else if (isLoggedUser) {
    navigate('/auth/event?id=106')
    return null
  }
}

const mapStateToProps = ({ loggedUserState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,  
})

export default connect(mapStateToProps)(IndexPage)