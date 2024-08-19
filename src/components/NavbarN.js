import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

function NavbarN() {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
      <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#f2f5f7' }}>
        <div className="container-fluid">
          <a className="navbar-brand fw-bold me-4" href="#">POS System</a>
          <span className="fw-bold px-5">Hi {user.username}</span>
        </div>
      </nav>
    )
}

export default NavbarN