import React, { useState } from 'react'
import SidebarItems from '../components/SidebarItems'
import SideBarColapse from '../components/SideBarColapse'
import { Button, Dropdown } from 'react-bootstrap'
import { faSearchMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';


function NavT() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true)

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed)

        const user = JSON.parse(localStorage.getItem('user'));
        const navigate = useNavigate();
    
        const handleLogout = () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            navigate('/login');
        };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-white">
                <div className="container-fluid">
                    <a className="navbar-brand text-dark" href="#">Navbar</a>
                    <button className="navbar-toggler bg-dark" type="button" onClick={handleNavCollapse} aria-controls="navbarSupportedContent" aria-expanded={!isNavCollapsed} aria-label="Toggle navigation">
                        <span ><FontAwesomeIcon icon={faSearchMinus} color='#f8f9fa' /></span>
                    </button>
                    <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-lg-none">
                            <SidebarItems title="Dashboard"
                                items1={<SideBarColapse title="Dashboard" destination="/dashboard" />} />
                            <SidebarItems title="Products"
                                items1={<SideBarColapse title="Products" destination="/products" />} />
                            <SidebarItems title="Orders"
                                items1={<SideBarColapse title="Orders" destination="/orders" />} />
                            <SidebarItems title="Customers"
                                items1={<SideBarColapse title="Customers" destination="/customers" />} />
                            <SidebarItems title="Reports"
                                items1={<SideBarColapse title="Reports" destination="/reports" />} />


                            <li className="nav-item">
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-basic" className="nav-link text-dark">
                                        Dashboard
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#">Action</Dropdown.Item>
                                        <Dropdown.Item href="#">Another action</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item href="#">Something else here</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                            <li className="nav-item">
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-basic" className="nav-link text-dark">
                                        Products
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#">View All</Dropdown.Item>
                                        <Dropdown.Item href="#">Add New</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item href="#">Categories</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                            <li className="nav-item">
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-basic" className="nav-link text-dark">
                                        Orders
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#">New Orders</Dropdown.Item>
                                        <Dropdown.Item href="#">Completed Orders</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item href="#">Order History</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                            <li className="nav-item">
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-basic" className="nav-link text-dark">
                                        Customers
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#">View All</Dropdown.Item>
                                        <Dropdown.Item href="#">Add New</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item href="#">Customer Groups</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                            <li className="nav-item">
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-basic" className="nav-link text-dark">
                                        Reports
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#">Sales Report</Dropdown.Item>
                                        <Dropdown.Item href="#">Inventory Report</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item href="#">Custom Reports</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                            <li className="nav-item">
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-basic" className="nav-link text-dark">
                                        Settings
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#">General Settings</Dropdown.Item>
                                        <Dropdown.Item href="#">User Management</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item href="#">System Logs</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                            </ul>
                            <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">




                                <span className="profile-username">

                                    <span className="fw-bold mx-2">Hi {user.username}
                                        <Button variant="danger" className='mx-2' onClick={handleLogout}>Logout</Button>
                                    </span>
                                </span>


                            </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default NavT