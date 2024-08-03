import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const SidebarItems = ({title,iconName,items1,items2,items3,items4}) => {
    const [open, setOpen] = useState(false);

    return (
        <li className="nav-item active">
            <Link
                onClick={() => setOpen(!open)}
                className="collapsed"
                aria-expanded={open}
                style={{ cursor: 'pointer' }}
            >
                <FontAwesomeIcon icon={iconName} />
                <p className='mx-2'> { title} </p>
                <span className="caret"></span>
            </Link>

            <Collapse in={open}>
                <div id="Transsection">
                    <ul className="nav nav-collapse">

                       {items1}
                       {items2}
                       {items3}
                       {items4}

                    </ul>
                </div>
            </Collapse>
        </li>
    );
};

export default SidebarItems;