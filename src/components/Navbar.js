import { Component } from "react";
import "./NavbarStyle.css";
import { MenuItems } from "./MenuItems";
import { Link, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Text from './Text';

class Navbar extends Component {
  state = {
    clicked: false,
    showNavbar: true,
    lastScrollY: 0,
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > this.state.lastScrollY) {
      this.setState({ showNavbar: false });
    } else {
      this.setState({ showNavbar: true });
    }

    this.setState({ lastScrollY: currentScrollY });
  };

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      this.setState({ clicked: false });
    }
  };

  handleLogoClick = (e) => {
    const { pathname } = window.location;
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  handleAboutClick = () => {
    const { pathname } = window.location;
    if (pathname !== "/") {
      const navigate = this.props.navigate;
      navigate("/", { replace: true });
      setTimeout(() => {
        scroller.scrollTo("team-member-section", {
          smooth: true,
          duration: 500,
          offset: -80,
        });
      }, 100);
    } else {
      scroller.scrollTo("team-member-section", {
        smooth: true,
        duration: 500,
        offset: -80,
      });
    }
  };

  render() {
    const { isAuthenticated, logout, currentLanguage, changeLanguage, t } = this.props;

    return (
      <nav
        className={`navbar-items ${this.state.showNavbar ? "show" : "hide"}`}
        onBlur={this.handleBlur}
        tabIndex="0"
      >
        <Link to="/" className="logo-link" onClick={this.handleLogoClick}>
          <img className="company-logo" src="/icon.png" alt="Lotus Voyages" />
        </Link>
        <Link to="/" className="logo-link" onClick={this.handleLogoClick}>
          <h1 className="navbar-logo">LOTUS VOYAGES</h1>
        </Link>
        
        <div className="menu-icons" onClick={this.handleClick}>
          <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>
        </div>
        
        <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
          {MenuItems.map((item, index) => {
            if (item.url === "/about") {
              return (
                <li key={index}>
                  <a className={item.cName} onClick={this.handleAboutClick}>
                    <i className={item.icon}></i>
                    {t(item.titleKey)}
                  </a>
                </li>
              );
            }
            return (
              <li key={index}>
                <Link className={item.cName} to={item.url}>
                  <i className={item.icon}></i>
                  {t(item.titleKey)}
                </Link>
              </li>
            );
          })}
          
          {isAuthenticated ? (
            <>
              <li>
                <Link className="nav-links" to="/admin">
                  <i className="fas fa-user-shield"></i>
                  {t('admin')}
                </Link>
              </li>
              <li>
                <a className="nav-links" onClick={logout} style={{ cursor: 'pointer' }}>
                  <i className="fas fa-sign-out-alt"></i>
                  {t('logout')}
                </a>
              </li>
            </>
          ) : (
            <Link
              to="/tour"
              className="signin-btn"
              style={{ textDecoration: "none", color: "black" }}
            >
              {t('bookNow')}
            </Link>
          )}

          <li className="language-selector">
            <div className="language-dropdown">
              <button className="language-btn">
                {currentLanguage === 'vi' ? '🇻🇳' : 
                 currentLanguage === 'en' ? '🇬🇧' : '🇫🇷'}
              </button>
              <div className="language-dropdown-content">
                <a onClick={() => changeLanguage('vi')} className={currentLanguage === 'vi' ? 'active' : ''}>
                  🇻🇳 Tiếng Việt
                </a>
                <a onClick={() => changeLanguage('en')} className={currentLanguage === 'en' ? 'active' : ''}>
                  🇬🇧 English
                </a>
                <a onClick={() => changeLanguage('fr')} className={currentLanguage === 'fr' ? 'active' : ''}>
                  🇫🇷 Français
                </a>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}

const NavbarWithNavigate = (props) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  
  return (
    <Navbar 
      {...props} 
      navigate={navigate} 
      isAuthenticated={isAuthenticated} 
      logout={logout} 
      currentLanguage={currentLanguage}
      changeLanguage={changeLanguage}
      t={t}
    />
  );
};

export default NavbarWithNavigate;