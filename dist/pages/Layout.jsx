import { Outlet, Link } from "react-router-dom";
import '../styles/Layout.css';

const Layout = () => {
  return (
    <>
      <nav>
        <div className="nav-menu">
          <div>
            <Link to="/">Login</Link>
          </div>
          <div>
            <Link to="/MyInfo">My Information</Link>
          </div>
          <div>
            <Link to="/MyExperience">My Experience</Link>
          </div>
          <div>
            <Link to="/Identity">Identity</Link>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;