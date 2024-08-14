import SideBar from './SideBar';
import Navbar from './Navbar';
import SidebarN from '../components/SidebarN';
import NavbarN from '../components/NavbarN';
import Sale from './Sale';
import React, { useState, useEffect } from 'react';
import { fetchSuppliers, createSupplier } from '../services/Api';
import { Form, Button, Container, Table } from 'react-bootstrap';



const MainScreen = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [contactInfo, setContactInfo] = useState('');

    useEffect(() => {
        fetchSuppliers().then((response) => setSuppliers(response.data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        createSupplier({ name, phone, contact_info: contactInfo }).then((response) => {
            setSuppliers([...suppliers, response.data]);
            setName('');
            setPhone('');
            setContactInfo('');
        }).catch((error) => {
            console.error('There was an error!', error);
        });
    };

    return (
        <div className="wrapper d-flex">
            <SidebarN />
            <div className="main-content">
                <NavbarN />
                <div className="p-3">
                    {/* Add your main content here */}


                </div>
            </div>
        </div>
    );
};

export default MainScreen;
