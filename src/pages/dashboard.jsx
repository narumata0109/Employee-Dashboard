import { useEffect, useState } from "react";
import DashboardSummary from "./dashboardSummary";
import NavBar from "./nav";

function Dashboard() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/employees")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        localStorage.setItem("employees", JSON.stringify(data));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <NavBar  />
      <DashboardSummary />
    </>
  );
}

export default Dashboard;
