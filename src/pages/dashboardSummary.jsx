import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Avatar,
  Divider,
  CircularProgress
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import WorkIcon from "@mui/icons-material/Work";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

function DashboardSummary() {
  const [employees, setEmployees] = useState([]);
  const username = localStorage.getItem("currentUser") || "Admin";
  const drawerWidth = 240;

  useEffect(() => {
    fetch("http://localhost:3001/employees")
      .then((res) => res.json())
      .then(setEmployees)
      .catch(console.error);
  }, []);

  const total = employees.length;
  const active = employees.filter((e) => e.active).length;
  const inactive = total - active;
  const male = employees.filter((e) => e.gender === "Male").length;
  const female = employees.filter((e) => e.gender === "Female").length;

  const statusChartData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [active, inactive],
        backgroundColor: ["#2e7d32", "#d32f2f"]
      }
    ]
  };

  const projectData = {
    labels: ["HR Portal", "Payroll System", "Employee App"],
    datasets: [
      {
        label: "Work Hours",
        data: [120, 80, 45],
        backgroundColor: ["#1976d2", "#2e7d32", "#ed6c02"],
        borderRadius: 8
      }
    ]
  };

  const projectOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw} hrs`
        }
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 20 } }
    }
  };

 return (
  <Box sx={{ display: "flex" }}>
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #1976d2, #42a5f5)",
          color: "#fff"
        }
      }}
    >
      <Toolbar />
      <List>
        {[
          { text: "Dashboard", icon: <DashboardIcon /> },
          { text: "All Employees", icon: <PeopleIcon /> },
          { text: "Add Employee", icon: <WorkIcon /> },
          { text: "Calendar", icon: <CalendarMonthIcon /> },
          { text: "Settings", icon: <SettingsIcon /> }
        ].map((item) => (
          <ListItem button key={item.text}>
            <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>

    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Welcome, {username} 👋</Typography>
          <Avatar>{username[0]}</Avatar>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 3,
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Box position="relative" display="inline-flex">
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={120}
                  thickness={5}
                  sx={{ color: "#1976d2" }}
                />
                <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="h4" fontWeight="bold">
                    {total}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="subtitle1" mt={2}>
                Total Employees
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, height: 300 }}>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Projects & Work Time
                </Typography>
                <Box sx={{ height: 160 }}>
                  <Bar data={projectData} options={projectOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, height: 350 }}>
              <CardContent>
                <Typography variant="h6">Gender Distribution</Typography>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-around">
                  <Box textAlign="center">
                    <MaleIcon color="primary" fontSize="large" />
                    <Typography>{male} Male</Typography>
                  </Box>
                  <Box textAlign="center">
                    <FemaleIcon color="secondary" fontSize="large" />
                    <Typography>{female} Female</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, height: 350 }}>
              <CardContent>
                <Typography variant="h6">Employee Status</Typography>
                <Doughnut data={statusChartData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Box>
);

}

export default DashboardSummary;
