import { Navbar, Nav, Container, OverlayTrigger, Popover } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PersonCircle } from "react-bootstrap-icons";


function NavBar () {
  const username = localStorage.getItem("currentUser");

const userPopover = (
  <Popover id="user-popover">
    <Popover.Body>
      <div>Hello <strong>{username} </strong></div>
    </Popover.Body>
  </Popover>
);
    return (
        <>
              <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary shadow-sm">
    <Container>
      <Navbar.Brand>Employee Dashboard</Navbar.Brand>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />

      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ms-auto align-items-center gap-3">
          <Nav.Link as={NavLink} to="/dashboard">Home</Nav.Link>
          <Nav.Link as={NavLink} to="/all-employee">All Employee</Nav.Link>
          <Nav.Link as={NavLink} to="/add-employee">Add New Employee</Nav.Link>

          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={userPopover}
            rootClose
          >
            <PersonCircle
              size={30}
              style={{ cursor: "pointer" }}
              title="User Profile"
            />
          </OverlayTrigger>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>

        </>
    )
}

export default NavBar;