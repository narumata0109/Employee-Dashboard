import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Switch,
  MenuItem,
  Box,
  Avatar,
  Typography
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";



    const states = [
    "Tamil Nadu",
    "Kerala",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana"
    ];

    const initialForm = {
    id: null,
    name: "",
    gender: "",
    dob: "",
    state: "",
    active: true,
    image: null
    };

function UpsertEmployee({  onSubmit }) {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const location = useLocation();
    const editData = location.state?.employee;
    const navigate = useNavigate();  
    const { id } = useParams();

    useEffect(() => {
        if (editData) {
        setForm({
      ...editData,
      id: Number(editData.id)
    });
        setPreview(editData.image || null);
        }
    }, [editData]);

    const validate = () => {
        const temp = {};
        if (!form.name) temp.name = "Full Name is required";
        if (!form.gender) temp.gender = "Gender is required";
        if (!form.dob) temp.dob = "Date of Birth is required";
        if (!form.state) temp.state = "State is required";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const validateField = (name, value) => {
        let message = "";

        switch (name) {
            case "name":
            if (!value.trim()) message = "Full Name is required";
            break;

            case "gender":
            if (!value) message = "Gender is required";
            break;

            case "dob":
            if (!value) message = "Date of Birth is required";
            break;

            case "state":
            if (!value) message = "State is required";
            break;

            default:
            break;
        }

        setErrors((prev) => ({
            ...prev,
            [name]: message
        }));
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        const fieldValue = type === "checkbox" ? checked : value;

        setForm((prev) => ({
            ...prev,
            [name]: fieldValue
        }));

        validateField(name, fieldValue);
    };


    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            setForm({
            ...form,
            image: reader.result
            });
            setPreview(reader.result);
        };

        reader.readAsDataURL(file);
    };


    const getNextId = async () => {
        const res = await fetch("http://localhost:3001/employees");
        const data = await res.json();

        if (data.length === 0) return 1;

        const maxId = Math.max(...data.map(emp => emp.id));
        return  String(maxId + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;        
        try {
            const payload = { ...form };            
        if (!form.id) {
            const nextId = await getNextId();
            payload.id = nextId;
            } else {
              payload.id = String(form.id);
            }
            const employeeId = Number(form.id);

            const url = form.id
            ? `http://localhost:3001/employees/${form.id}`
            : "http://localhost:3001/employees";

            const method = form.id ? "PUT" : "POST";

            const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
            });
        const savedEmployee = await response.json();
        toast.success(form.id ? "Employee Updated" : "Employee Added");
            navigate("/all-employee");
        } catch (error) {
            console.error("Save failed:", error);
            alert("Something went wrong");
        }
    };

  return (
    <>
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      p: 2
    }}
  >
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 450,
        bgcolor: "#fff",
        p: 4,
        borderRadius: 3,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}
    >
      <Typography
        variant="h5"
        mb={3}
        textAlign="center"
        fontWeight="bold"
        color="primary"
      >
        {form.id ? "Edit Employee" : "Add Employee"}
      </Typography>

      <Box mb={3} textAlign="center">
        <Avatar
          src={preview}
          sx={{
            width: 90,
            height: 90,
            mx: "auto",
            mb: 1,
            border: "2px solid #1976d2"
          }}
        />
        <Button variant="outlined" component="label" size="small">
          Upload Image
          <input hidden type="file" accept="image/*" onChange={handleImage} />
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        margin="normal"
      />

      <FormLabel sx={{ mt: 2 }}>Gender</FormLabel>
      <RadioGroup row name="gender" value={form.gender} onChange={handleChange}>
        <FormControlLabel value="Male" control={<Radio />} label="Male" />
        <FormControlLabel value="Female" control={<Radio />} label="Female" />
      </RadioGroup>
      {errors.gender && (
        <Typography color="error" variant="caption">
          {errors.gender}
        </Typography>
      )}

      <TextField
        fullWidth
        type="date"
        label="Date of Birth"
        name="dob"
        value={form.dob}
        onChange={handleChange}
        error={!!errors.dob}
        helperText={errors.dob}
        InputLabelProps={{ shrink: true }}
        margin="normal"
      />

      <TextField
        select
        fullWidth
        label="State"
        name="state"
        value={form.state}
        onChange={handleChange}
        error={!!errors.state}
        helperText={errors.state}
        margin="normal"
      >
        {states.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>

      <FormControlLabel
        sx={{ mt: 1 }}
        control={
          <Switch
            checked={form.active}
            name="active"
            onChange={handleChange}
          />
        }
        label="Active"
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 3,
          py: 1.3,
          fontSize: "16px",
          borderRadius: 2
        }}
      >
        {form.id ? "Update Employee" : "Add Employee"}
      </Button>
    </Box>
  </Box>
</>

  );
}

export default UpsertEmployee;
