import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './sidebar.css'; // Create a CSS file to handle your styles
import { Link, useNavigate } from 'react-router-dom';


function SidebarN() {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    const [expandedItems, setExpandedItems] = useState({});

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleItem = (itemId) => {
        setExpandedItems(prevState => ({
            ...prevState,
            [itemId]: !prevState[itemId]
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    useEffect(() => {
        const sidebar = document.getElementById('sidebar');
        const handleMouseEnter = () => setIsExpanded(true);
        const handleMouseLeave = () => setIsExpanded(false);

        sidebar.addEventListener('mouseenter', handleMouseEnter);
        sidebar.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            sidebar.removeEventListener('mouseenter', handleMouseEnter);
            sidebar.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <aside id="sidebar" className={isExpanded ? "expand" : ""}>
            <div className="d-flex">
                <button className="toggle-btn" type="button" onClick={toggleSidebar}>
                    <i className="bi bi-grid"></i>
                </button>
                <div className="sidebar-logo">
                    <Link to={'/dashboard'}>Insaf Food</Link>
                </div>
            </div>

            <ul className="sidebar-nav">
                <li className="sidebar-item">
                    <Link to={'/dashboard'} className="sidebar-link">
                        <i className="bi bi-house-fill"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>


                <li className="sidebar-item">
                    <Link to={'/sale'} className="sidebar-link">
                        <i className="bi bi-cart3"></i>
                        <span>Sale</span>
                    </Link>
                </li>


                <li className="sidebar-item">
                    <Link className={`sidebar-link ${expandedItems['stock'] ? '' : 'collapsed'}`} onClick={() => toggleItem('stock')}>
                        <i className="bi bi-box"></i>
                        <span>Stock</span>
                    </Link>
                    <ul id="auth" className={`sidebar-dropdown list ${expandedItems['stock'] ? 'show' : 'collapse'}`}>
                        <li className="sidebar-item">
                            <Link to={'/Products'} className="sidebar-link"><i className="bi bi-box-seam"></i>Products</Link>
                        </li>
                        <li className="sidebar-item">
                            <Link to={'/AddToStock'} className="sidebar-link"><i className="bi bi-plus-square"></i>Add Stock</Link>
                        </li>
                        <li className="sidebar-item">
                            <Link to={'/ProductStock'} className="sidebar-link"><i className="bi bi-eye"></i>View Stock</Link>
                        </li>

                    </ul>
                </li>

                <li className="sidebar-item">
                    <Link to={'/bank'} className="sidebar-link">
                        <i className="bi bi-bank"></i>
                        <span>Bank</span>
                    </Link>
                </li>


                <li className="sidebar-item">
                    <Link className={`sidebar-link ${expandedItems['transaction'] ? '' : 'collapsed'}`} onClick={() => toggleItem('transaction')}>
                        <i className="bi bi-cash-coin"></i>
                        <span>Transsections</span>
                    </Link>
                    <ul id="auth" className={`sidebar-dropdown list ${expandedItems['transaction'] ? 'show' : 'collapse'}`}>
                        <li className="sidebar-item">
                            <Link to={'/Cash'} className="sidebar-link"><i className="bi bi-box-seam"></i>cash</Link>
                        </li>
                        
                        <li className="sidebar-item">
                            <Link to={'/liabilities'} className="sidebar-link"><i className="bi bi-eye"></i>Liabilities</Link>
                        </li>

                    </ul>
                </li>



                <li className="sidebar-item">
                    <Link to={'/assets'} className="sidebar-link">
                        <i className="bi bi-columns-gap"></i>
                        <span>Assets</span>
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link to={'/Suppliers'} className="sidebar-link">
                        <i className="bi bi-truck"></i>
                        <span>Suppliers</span>
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link to={'/login'} className="sidebar-link">
                        <i className="bi bi-journal"></i>
                        <span>More</span>
                    </Link>
                </li>




            </ul>



            <div className="sidebar-footer">
                <button className="sidebar-link mb-4 px-2" onClick={handleLogout} style={{ background: 'none', border: 'none', color:'white' }}>
                    <i className="bi bi-box-arrow-right"> </i>
                
                LogOut
                </button>            
                </div>
        </aside>
    );
}

export default SidebarN