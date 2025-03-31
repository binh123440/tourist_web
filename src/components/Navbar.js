import { Component } from "react";
import "./NavbarStyle.css";
import { MenuItems } from "./MenuItems";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Link as scroller } from "react-scroll"; // Import react-scroll

class Navbar extends Component {
  state = { clicked: false };

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      this.setState({ clicked: false });
    }
  };

  handleLogoClick = (e) => {
    const { pathname } = window.location; // Lấy đường dẫn hiện tại
    if (pathname === "/") {
      e.preventDefault(); // Ngăn điều hướng lại trang
      window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang
    }
  };

  handleAboutClick = () => {
    const { pathname } = window.location; // Lấy đường dẫn hiện tại
    if (pathname !== "/") {
      // Nếu không ở trang chủ, chuyển về trang chủ
      const navigate = this.props.navigate; // Lấy navigate từ props
      navigate("/", { replace: true }); // Điều hướng về trang chủ
      setTimeout(() => {
        // Cuộn xuống phần "Team Member" sau khi chuyển trang
        scroller.scrollTo("team-member-section", {
          smooth: true,
          duration: 500,
          offset: -80,
        });
      }, 100); // Đợi một chút để đảm bảo trang đã tải xong
    } else {
      // Nếu đang ở trang chủ, cuộn xuống phần "Team Member"
      scroller.scrollTo("team-member-section", {
        smooth: true,
        duration: 500,
        offset: -80,
      });
    }
  };

  render() {
    return (
      <nav className="navbar-items" onBlur={this.handleBlur} tabIndex="0">
        {/* Logo dẫn đến trang chủ */}
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
              // Sử dụng react-scroll cho nút "Về chúng tôi"
              return (
                <li key={index}>
                  <a
                    className={item.cName}
                    onClick={this.handleAboutClick} // Gọi hàm xử lý
                  >
                    <i className={item.icon}></i>
                    {item.title}
                  </a>
                </li>
              );
            }
            return (
              <li key={index}>
                <Link className={item.cName} to={item.url}>
                  <i className={item.icon}></i>
                  {item.title}
                </Link>
              </li>
            );
          })}
          <Link
            to="/tour"
            className="signin-btn"
            style={{ textDecoration: "none", color: "black" }}
          >
            Đặt lịch ngay
          </Link>
        </ul>
      </nav>
    );
  }
}

// Sử dụng HOC để truyền navigate vào props
const NavbarWithNavigate = (props) => {
  const navigate = useNavigate();
  return <Navbar {...props} navigate={navigate} />;
};

export default NavbarWithNavigate;