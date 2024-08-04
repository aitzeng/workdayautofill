import { Outlet, Link } from "react-router-dom";
import './Layout.css';

const Layout = () => {
  return (
    <>
      <nav>
        <div className="nav-menu">
          <div>
            <Link to="/">Login</Link>
          </div>
          <div>
            <Link to="/MyInfo">Background</Link>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;