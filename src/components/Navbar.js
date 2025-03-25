import { Component } from "react"
import "./NavbarStyle.css"
import { MenuItems } from "./MenuItems"
import { Link } from "react-router-dom"

class Navbar extends Component{
    state = {clicked: false}
    handleClick = () =>{
        this.setState({clicked: !this.state.clicked})
    }
    handleBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          this.setState({ clicked: false });
        }
      };
    render(){
        return(
            <nav className="navbar-items" onBlur={this.handleBlur} tabIndex="0">
            <img className="company-logo" src="icon.png" alt="Lotus Voyages"/>
            <h1 className="navbar-logo">LOTUS VOYAGES</h1>
            <div className="menu-icons" onClick={this.handleClick}>
                <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>
            </div>
            <ul  className={this.state.clicked ? "nav-menu active" : "nav-menu"} >
                {MenuItems.map((item, index)=>{
                    return( 
                        <li key={index}>
                            <Link className={item.cName} to={item.url}>
                            <i className={item.icon}></i>{item.title}
                            </Link>
                        </li>
                    )
                })}
                <Link to="/tour" className="signin-btn" style={{textDecoration: "none", color: "black"}} >Đặt lịch ngay</Link>

            </ul>
        </nav>
        )
       
    }
}

export default Navbar