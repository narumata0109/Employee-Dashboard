import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import { PencilSquare, Trash, Printer } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  MenuItem,
  Box
} from "@mui/material";
import NavBar from "./nav";

const columns = [
  { id: "id", label: "Emp ID", minWidth: 80 },
  { id: "name", label: "Full Name", minWidth: 170 },
  { id: "gender", label: "Gender", minWidth: 100 },
  { id: "dob", label: "DOB", minWidth: 120 },
  { id: "state", label: "State", minWidth: 120 },
  { id: "active", label: "Status", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 150 }

];

function EmployeeTable() {
  const [employees, setEmployees] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [genderFilter, setGenderFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [printEmployee, setPrintEmployee] = React.useState(null);

  React.useEffect(() => {
    fetch("http://localhost:3001/employees")
      .then((res) => res.json())
      .then((data) => {
        
        const mappedEmployees = data.map((user) => ({
          id: user.id,
          name: `${user.name}`,
          gender: user.gender,
          dob: user.dob,
          state: user.state || "NA",
          active: user.active,
          image: user.image || null
        }));

        setEmployees(mappedEmployees);
        localStorage.setItem("employees", JSON.stringify(mappedEmployees));
      })
      .catch(console.error);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

 const handleEdit = (row) => {
  
  navigate(`/employee/${row.id}`, {
    state: { employee: row }
  });
};


const handleDelete = async (id) => {
  
  if (!window.confirm("Are you sure you want to delete?")) return;

  try {
    await fetch(`http://localhost:3001/employees/${id}`, {
      method: "DELETE"
    });

    setEmployees((prev) =>
      prev.filter((emp) => emp.id !== id)
    );

    const updated = employees.filter((emp) => emp.id !== id);
    localStorage.setItem("employees", JSON.stringify(updated));
    toast.warning("Employee deleted successfully");

  } catch (error) {
    console.error("Delete failed", error);
    toast.error("Failed to delete employee");
  }
};


const handlePrint = (row) => {
  setPrintEmployee(row);
  setTimeout(() => {
    window.print();
  }, 100);
};


const filteredEmployees = employees.filter((emp) => {
  const matchName =
    emp.name.toLowerCase().includes(search.toLowerCase());

  const matchGender =
    genderFilter === "All" || emp.gender === genderFilter;

  const matchStatus =
    statusFilter === "All" ||
    (statusFilter === "Active" && emp.active) ||
    (statusFilter === "Inactive" && !emp.active);

  return matchName && matchGender && matchStatus;
});

  return (
    <>
    <div className="mb-5">
      <NavBar />
    </div>
    <div className="container">
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
          justifyContent: "flex-end"
        }}
      >
        <TextField
          label="Search by Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />

        <TextField
          select
          label="Gender"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>

        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];

                      return (
                          <TableCell key={column.id}>
                              {column.id === "active" ? (
                                  <Switch checked={value} />
                              ) : column.id === "actions" ? (
                                  <>
                                  <IconButton color="primary" onClick={() => handleEdit(row)}>
                                      <PencilSquare size={20} className="me-2 text-primary" />
                                  </IconButton>

                                  <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                      <Trash size={20} className="me-2 text-danger" />
                                  </IconButton>

                                  <IconButton color="secondary" onClick={() => handlePrint(row)}>
                                      <Printer size={20} className="text-success" />
                                  </IconButton>
                                  </>
                              ) : (
                                  value
                              )}
                          </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
   {printEmployee && (
  <div className="print-only">
    <h2>Employee Details</h2>

    {printEmployee.image && (
      <img
        src={printEmployee.image}
        alt="Profile"
        style={{
          width: "120px",
          height: "120px",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "16px",
          border: "1px solid #ccc"
        }}
      />
    )}

    <p><strong>ID:</strong> {printEmployee.id}</p>
    <p><strong>Name:</strong> {printEmployee.name}</p>
    <p><strong>Gender:</strong> {printEmployee.gender}</p>
    <p><strong>DOB:</strong> {printEmployee.dob}</p>
    <p><strong>State:</strong> {printEmployee.state}</p>
    <p><strong>Status:</strong> {printEmployee.active ? "Active" : "Inactive"}</p>
  </div>
)}


    </>
  );
}

export default EmployeeTable