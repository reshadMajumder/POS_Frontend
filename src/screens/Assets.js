import SidebarN from '../components/SidebarN';
import NavbarN from '../components/NavbarN';
import { Table, Button, Form, Modal, Container, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { fetchAssets, fetchBanks, addAsset, updateAsset, deleteAsset } from '../services/Api';

function Assets() {
    const [assets, setAssets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentAsset, setCurrentAsset] = useState({ name: '', amount: '', purchase_date: '', bank: '' });
    const [banks, setBanks] = useState([]);

    useEffect(() => {
        fetchAssets()
            .then(response => setAssets(response.data))
            .catch(error => console.error('Error fetching assets:', error));

        fetchBanks()
            .then(response => setBanks(response.data))
            .catch(error => console.error('Error fetching banks:', error));
    }, []);

    const handleAddUpdateAsset = async () => {
        try {
            if (currentAsset.id) {
                await updateAsset(currentAsset.id, currentAsset);
            } else {
                await addAsset(currentAsset);
            }
            setShowModal(false);
            fetchAssets()
                .then(response => setAssets(response.data))
                .catch(error => console.error('Error fetching assets:', error));
        } catch (error) {
            console.error('Error saving asset:', error);
        }
    };

    const handleDeleteAsset = async (id) => {
        try {
            await deleteAsset(id);
            fetchAssets()
                .then(response => setAssets(response.data))
                .catch(error => console.error('Error fetching assets:', error));
        } catch (error) {
            console.error('Error deleting asset:', error);
        }
    };

    const handleShowModal = (asset) => {
        setCurrentAsset(asset || { name: '', amount: '', purchase_date: '', bank: '' });
        setShowModal(true);
    };

    return (
        <div className="d-flex">
            <SidebarN />
            <div className="main-content flex-grow-1 ">
                <NavbarN />
                <Container fluid>
                    <Row className="mb-4">
                        <Col>
                            <h2 className="text-center">Manage Assets</h2>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col className="text-end">
                            <Button variant="primary" onClick={() => handleShowModal(null)}>
                                Add Asset
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col >
                            <Table striped bordered hover responsive className="bg-white shadow-sm ">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Purchase Date</th>
                                        <th>Bank</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assets.map(asset => (
                                        <tr key={asset.id}>
                                            <td>{asset.name}</td>
                                            <td>{asset.amount}</td>
                                            <td>{new Date(asset.purchase_date).toLocaleDateString()}</td>
                                            <td>{banks.find(bank => bank.id === asset.bank)?.name || 'N/A'}</td>
                                            <td className="text-center">
                                                <Button 
                                                    variant="warning" 
                                                    size="sm" 
                                                    onClick={() => handleShowModal(asset)}
                                                    className="me-2"
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    size="sm" 
                                                    onClick={() => handleDeleteAsset(asset.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>

                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{currentAsset.id ? 'Edit' : 'Add'} Asset</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formAssetName" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentAsset.name}
                                    onChange={e => setCurrentAsset({ ...currentAsset, name: e.target.value })}
                                    placeholder="Enter asset name"
                                />
                            </Form.Group>
                            <Form.Group controlId="formAssetAmount" className="mb-3">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={currentAsset.amount}
                                    onChange={e => setCurrentAsset({ ...currentAsset, amount: e.target.value })}
                                    placeholder="Enter amount"
                                />
                            </Form.Group>
                            <Form.Group controlId="formAssetDate" className="mb-3">
                                <Form.Label>Purchase Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={currentAsset.purchase_date || new Date().toISOString().split('T')[0]}
                                    onChange={e => setCurrentAsset({ ...currentAsset, purchase_date: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formAssetBank" className="mb-3">
                                <Form.Label>Bank</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={currentAsset.bank}
                                    onChange={e => setCurrentAsset({ ...currentAsset, bank: e.target.value })}
                                >
                                    <option value="">Select a bank</option>
                                    {banks.map(bank => (
                                        <option key={bank.id} value={bank.id}>{bank.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleAddUpdateAsset}>
                            {currentAsset.id ? 'Update' : 'Add'} Asset
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Assets;
