import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };


    return (
        <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            <div>
                <div className="main-header-logo">
                    {/* <!-- Logo Header --> */}
                    <div className="logo-header" data-background-color="dark">
                        <a href="index.html" className="logo">
                            <img src="assets/img/kaiadmin/logo_light.png" alt="navbar brand" className="navbar-brand"
                                height="20" />
                        </a>
                        <div className="nav-toggle">

                            <button className="btn btn-toggle toggle-sidebar">
                                <i className="gg-menu-right"></i>
                            </button>
                            <button className="btn btn-toggle sidenav-toggler">
                                <i className="gg-menu-left"></i>
                            </button>
                        </div>
                        <button className="topbar-toggler more">
                            <i className="gg-more-vertical-alt"></i>
                        </button>
                    </div>
                    {/* <!-- End Logo Header --> */}
                </div>
            </div>
            
            <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
                <div className="container-fluid">
                    


                    <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">



                                
                                <span className="profile-username">

                                    <span className="fw-bold mx-2">Hi {user.username}  
                                    <Button variant="danger" className='mx-2' onClick={handleLogout}>Logout</Button>
                                    </span>
                                </span>
                                
                           
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;