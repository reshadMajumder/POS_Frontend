import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import SidebarN from '../components/SidebarN';
import NavbarN from '../components/NavbarN';
import EditBillModal from '../components/EditSaleBillModal';

const API_URL = 'http://127.0.0.1:8000/api/';

export const searchBills = (query) => {
    return axios.get(`${API_URL}search_bills/?query=${query}`);
};

export const updateBill = (id, data) => {
    return axios.put(`${API_URL}bills/${id}/update/`, data);
};

function SaleReturn() {
    const [query, setQuery] = useState('');
    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                if (query) {
                    const response = await searchBills(query);
                    // Adjust the structure to extract bill data
                    const formattedBills = response.data.map(bill => ({
                        ...bill,
                        items: bill.items.map(item => ({
                            ...item,
                            bill: item.bill.id, // Extracting bill ID for the PUT request
                            product: item.product.id, // Extracting product ID for the PUT request
                        }))
                    }));
                    setBills(formattedBills);
                } else {
                    setBills([]);
                }
            } catch (error) {
                console.error('Error fetching bills:', error);
            }
        };

        fetchBills();
    }, [query]);

    const handleEditBill = (bill) => {
        setSelectedBill(bill);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBill(null);
    };

    const handleSaveChanges = async (updatedBill) => {
        // Format the bill data before sending it to the API
        const dataToSave = {
            id: updatedBill.id,
            items: updatedBill.items.map(item => ({
                id: item.id,
                quantity: item.quantity,
                selling_price_per_unit: item.selling_price_per_unit,
                bill: item.bill, // Use bill ID
                product: item.product // Use product ID
            })),
            customer_phone: updatedBill.customer_phone,
            total_amount: updatedBill.total_amount,
            vat_amount: updatedBill.vat_amount,
            discount: updatedBill.discount || "0.00",
            total_cost: updatedBill.total_cost,
            total_profit_or_loss: updatedBill.total_profit_or_loss,
            total_Bill: updatedBill.total_Bill,
            vat_rate: updatedBill.vat_rate,
            created_at: updatedBill.created_at,
            total_paid: updatedBill.total_paid,
            total_due: updatedBill.total_due,
            payment_method: updatedBill.payment_method,
            updated_at: new Date().toISOString().slice(0, 10)
        };

        try {
            const response = await updateBill(updatedBill.id, dataToSave);
            console.log('Bill updated successfully:', response.data);
            handleCloseModal(); // Close the modal after saving changes
        } catch (error) {
            console.error('Error updating bill:', error);
        }
    };

    return (
        <div className="wrapper d-flex">
            <SidebarN />
            <div className="main-content" style={{ overflow: 'hidden' }}>
                <NavbarN />
                <div className="p-3">
                    <div className="container-fluid pt-1" style={{ overflow: 'auto' }}>
                        <div className="page-inner">
                            <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                                <div>
                                    <h3 className="fw-bold">Manage Bills</h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-9">
                                    <div className="card">
                                        <div className="nav-search d-lg-flex pt-1 m-2">
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    placeholder="Search bills by ID, phone, or date"
                                                    className="form-control"
                                                    value={query}
                                                    onChange={(e) => setQuery(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card mb-5">
                                        <div className="card-header">
                                            <div className="card-title">Search Results</div>
                                        </div>
                                        <div className="card-body pt-1" style={{ height: '50vh', overflow: 'auto' }}>
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>Bill ID</th>
                                                        <th>Customer Phone</th>
                                                        <th>Date</th>
                                                        <th>Total Amount</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bills.length > 0 ? (
                                                        bills.map((bill, index) => (
                                                            <tr key={index}>
                                                                <td>{bill.id}</td>
                                                                <td>{bill.customer_phone}</td>
                                                                <td>{bill.created_at}</td>
                                                                <td>{bill.total_amount}</td>
                                                                <td>
                                                                    <Button variant="primary" onClick={() => handleEditBill(bill)}>
                                                                        Edit
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="text-center">No bills found</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedBill && (
                                <EditBillModal
                                    showModal={showModal}
                                    selectedBill={selectedBill}
                                    handleCloseModal={handleCloseModal}
                                    handleSaveChanges={handleSaveChanges}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SaleReturn;
