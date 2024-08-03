import React, { useState, useEffect } from 'react';
import { fetchStocks } from '../services/Api';
import { Table, Container } from 'react-bootstrap';
import SideBar from './SideBar';
import NavT from './NavT';
import Navbar from './Navbar';

function ProductStock(){
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        fetchStocks().then((response) => setStocks(response.data));
    }, []);

    return (
        <div className="wrapper">
            <SideBar />
            <div className="main-panel">
                <div className="main-header">
                <Navbar/>
                </div>
                <div className="container-fluid" style={{ height: 'calc(100vh - 70px)', overflow: 'auto', marginTop: '70px' }}>
                <div className="page-inner">
                              <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                                  <div>
                                      <h3 className="fw-bold">Available stock</h3>
                                  </div>
                              </div>
                <div className="row">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Stock List</div>
                            <Container>
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
                                        {stocks.map((stock, index) => (
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
                            </Container>
                        </div>
                    </div>
                </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default ProductStock;