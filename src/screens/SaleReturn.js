import React from 'react'
import SidebarN from '../components/SidebarN'
import NavbarN from '../components/NavbarN'
import { Col, Container, Row } from 'react-bootstrap'

function SaleReturn() {
  return (
    <div className="d-flex">
    <SidebarN />
    <div className="main-content flex-grow-1 ">
        <NavbarN />
        <Container>
        <Row className="mb-4">
                <Col>
                    <h2 className="text-center">Return sold products</h2>
                </Col>
            </Row>
            

        </Container>

    </div>
</div>
  )
}

export default SaleReturn