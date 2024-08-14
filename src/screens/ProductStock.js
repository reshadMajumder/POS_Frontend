import React, { useState, useEffect } from 'react';
import { fetchStocks } from '../services/Api';
import { Table, Container, Form } from 'react-bootstrap';
import NavbarN from '../components/NavbarN';
import SidebarN from '../components/SidebarN';

function ProductStock(){
    const [stocks, setStocks] = useState([]);
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        fetchStocks().then((response) => {
            setStocks(response.data);
            setFilteredStocks(response.data);
        });
    }, []);

    useEffect(() => {
        if (selectedMonth) {
            const filtered = stocks.filter(stock => {
                const stockDate = new Date(stock.date_purchased);
                return stockDate.getMonth() === parseInt(selectedMonth) - 1;
            });
            setFilteredStocks(filtered);
        } else {
            setFilteredStocks(stocks);
        }
    }, [selectedMonth, stocks]);

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    return (
        <div className="wrapper d-flex">
            <SidebarN />
            <div className="main-content" style={{overflow: 'hidden'}}>
                <NavbarN />
                <div className="p-3">
                    {/* Add your main content here */}

                <div className="row">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Product Stock List</div>
                            <Form.Group className="mb-3 mt-2 " style={{ maxWidth: '200px' }}>
                                <Form.Label>Filter by Month:</Form.Label>
                                <Form.Control as="select" value={selectedMonth} onChange={handleMonthChange}>
                                    <option value="">All Months</option>
                                    <option value="1">January</option>
                                    <option value="2">February</option>
                                    <option value="3">March</option>
                                    <option value="4">April</option>
                                    <option value="5">May</option>
                                    <option value="6">June</option>
                                    <option value="7">July</option>
                                    <option value="8">August</option>
                                    <option value="9">September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                </Form.Control>
                            </Form.Group>
                            <Container>
                                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Product</th>
                                                <th>Supplier</th>
                                                <th>Quantity</th>
                                                <th>Supplier Price per Unit</th>
                                                <th>Date Purchased</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStocks.map((stock, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{stock.product.name}</td>
                                                    <td>{stock.supplier.name}</td>
                                                    <td>{stock.quantity}</td>
                                                    <td>{stock.supplier_price_per_unit}</td>
                                                    <td>{new Date(stock.date_purchased).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Container>
                        </div>
                    </div>
                </div>
                </div>
                </div>
            </div>
    );
}

export default ProductStock;