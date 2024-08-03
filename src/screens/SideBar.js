import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/js/kaiadmin.js';
import SidebarItems from '../components/SidebarItems.js';
import SideBarColapse from '../components/SideBarColapse.js';
import './sidebar.css';
import { faHome, faMoneyBills, faSignal, faStickyNote, faLayerGroup, faTachometer, faHands } from '@fortawesome/free-solid-svg-icons';

function SideBar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    // function for logout

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} data-background-color="dark">
            <div className="sidebar-logo d-flex align-items-center justify-content-between">
                <Link to={"/dashboard"} className="logo">
                    <span>Insaf food</span>
                </Link>
                <button className="btn btn-toggle toggle-sidebar" onClick={toggleSidebar}>
                    <i className={isCollapsed ? 'gg-menu-left' : 'gg-menu-right'}></i>
                </button>
            </div>
            <div className={`sidebar-wrapper scrollbar scrollbar-inner ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-content">
                    <ul className="nav nav-secondary">
                        <SidebarItems title="Dashboard" iconName={faHome} 
                        items1={<SideBarColapse title="Dashboard" destination="/dashboard" />} />

                        <SidebarItems title="Point of Sale" iconName={faMoneyBills} 
                        items1={<SideBarColapse title="Sale" destination="/sale" />} />
                        
                        <SidebarItems title="Stock" iconName={faSignal} 
                        items1={<SideBarColapse title="Add Stock" destination="/AddToStock" />} 
                        items2={<SideBarColapse title="Products" destination="/Products" />} 
                        items3={<SideBarColapse title="View Stock" destination="/ProductStock" />} />

                        
                        <SidebarItems title="Transactions" iconName={faLayerGroup} 
                        items1={<SideBarColapse title="Transaction" destination="/login" />} />


                        <SidebarItems title="Expense" iconName={faStickyNote} 
                        items1={<SideBarColapse title="Expense" destination="/login" />} />

                        <SidebarItems title="Suppliers" iconName={faHands} 
                        items1={<SideBarColapse title="Suppliers" destination="/Suppliers" />} />

                        <SidebarItems title="More" iconName={faTachometer} 
                        items1={<SideBarColapse title="More" destination="/login" />} />

                    </ul>
                </div>
            </div>
        </div>
    );
}

export default SideBar;
