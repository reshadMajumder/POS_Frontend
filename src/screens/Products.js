import React, { useState, useEffect } from 'react';
import { fetchProducts, createProduct, fetchUnit } from '../services/Api';
import { Form, Button, Container, Table, Navbar } from 'react-bootstrap';
import SideBar from './SideBar';
import NavT from './NavT';

function Products() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [sellingPricePerUnit, setSellingPricePerUnit] = useState('');
    const [units, setUnits] = useState([]);

    useEffect(() => {
        fetchProducts().then((response) => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
        fetchUnit().then((response) => setUnits(response.data))
            .catch(error => console.error('Error fetching units:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        createProduct({ name, unit, selling_price_per_unit: sellingPricePerUnit })
            .then((response) => {
                setProducts([...products, response.data]);
                setName('');
                setUnit('');
                setSellingPricePerUnit('');
            })
            .catch(error => console.error('Error creating product:', error));
    };

    return (
        <div className="wrapper">
            <SideBar />
            <div className="main-panel">
                <div className="main-header">
                    <Navbar/>
                </div>
                <div className="row">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Products</div>
                            <Container>
                                <h2>Products</h2>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formProductName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter product name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formProductUnit">
                                        <Form.Label>Unit</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value)}
                                        >
                                            <option value="">Select a unit</option>
                                            {units.map((u) => (
                                                <option key={u.id} value={u.name}>
                                                    {u.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="formProductSellingPricePerUnit">
                                        <Form.Label>Selling Price per Unit</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter selling price per unit"
                                            value={sellingPricePerUnit}
                                            onChange={(e) => setSellingPricePerUnit(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Add Product
                                    </Button>
                                </Form>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Unit</th>
                                            <th>Selling Price per Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, index) => (
                                            <tr key={product.id}>
                                                <td>{index + 1}</td>
                                                <td>{product.name}</td>
                                                <td>{product.unit}</td>
                                                <td>{product.selling_price_per_unit}</td>
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
    );
}

export default Products;