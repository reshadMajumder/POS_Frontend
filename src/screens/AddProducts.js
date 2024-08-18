import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchSuppliers, createStock } from '../services/Api';
import { Form, Button, Alert, Row, Col, Card, Table } from 'react-bootstrap';

import NavbarN from '../components/NavbarN';
import SidebarN from '../components/SidebarN';

function AddProducts() {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [productId, setProductId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [supplierPricePerUnit, setSupplierPricePerUnit] = useState('');
    const [datePurchased, setDatePurchased] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [billingItems, setBillingItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsResponse = await fetchProducts();
                setProducts(productsResponse.data);

                const suppliersResponse = await fetchSuppliers();
                setSuppliers(suppliersResponse.data);
            } catch (error) {
                setError('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await createStock({
                product: productId,
                supplier: supplierId,
                quantity,
                supplier_price_per_unit: supplierPricePerUnit,
                date_purchased: datePurchased
            });
            alert('Stock added successfully!');

            // Add item to billing section
            const selectedProduct = products.find(p => p.id === productId);
            const selectedSupplier = suppliers.find(s => s.id === supplierId);
            setBillingItems([...billingItems, {
                product: selectedProduct.name,
                supplier: selectedSupplier.name,
                quantity,
                price: supplierPricePerUnit,
                total: quantity * supplierPricePerUnit
            }]);

            // Reset form
            setProductId('');
            setSupplierId('');
            setQuantity('');
            setSupplierPricePerUnit('');
            setDatePurchased('');
        } catch (error) {
            setError('Error adding stock. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="wrapper d-flex">
            <SidebarN />
            <div className="main-content">
                <NavbarN />
                <div className="p-3">
                    {/* Add your main content here */}
                    <div className="container-fluid pt-5 mt-4" >
                    <div className="page-inner" style={{ height: 'calc(100vh - 70px)', overflow: 'auto' }} >
                        
                        <Row >
                            <Col md={8}>
                                <Card>
                                    <Card.Header>
                                        <Card.Title>Add Product Stock</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        {error && <Alert variant="danger">{error}</Alert>}
                                        <Form onSubmit={handleSubmit}>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group controlId="formProduct">
                                                        <Form.Label>Product</Form.Label>
                                                        <Form.Control
                                                            as="select"
                                                            value={productId}
                                                            onChange={(e) => setProductId(e.target.value)}
                                                        >
                                                            <option value="">Select a product</option>
                                                            {products.map((product) => (
                                                                <option key={product.id} value={product.id}>{product.name}</option>
                                                            ))}
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group controlId="formSupplier">
                                                        <Form.Label>Supplier</Form.Label>
                                                        <Form.Control
                                                            as="select"
                                                            value={supplierId}
                                                            onChange={(e) => setSupplierId(e.target.value)}
                                                        >
                                                            <option value="">Select a supplier</option>
                                                            {suppliers.map((supplier) => (
                                                                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                                            ))}
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <Form.Group controlId="formQuantity">
                                                        <Form.Label>Quantity</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="Enter quantity"
                                                            value={quantity}
                                                            onChange={(e) => setQuantity(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group controlId="formSupplierPricePerUnit">
                                                        <Form.Label>Supplier Price per Unit</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="Enter supplier price per unit"
                                                            value={supplierPricePerUnit}
                                                            onChange={(e) => setSupplierPricePerUnit(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group controlId="formDatePurchased">
                                                        <Form.Label>Date Purchased</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={datePurchased}
                                                            onChange={(e) => setDatePurchased(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Button variant="primary" type="submit">
                                                Add Stock
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card>
                                    <Card.Header>
                                        <Card.Title>Billing Section</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {billingItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.product}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>${item.price}</td>
                                                        <td>${item.total.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                        <div className="text-right">
                                            <strong>Total: ${billingItems.reduce((acc, item) => acc + item.total, 0).toFixed(2)}</strong>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>


                </div>
            </div>
        </div>

    );
}

export default AddProducts;
