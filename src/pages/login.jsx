import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {  Form, Button, Card } from "react-bootstrap";
import { PersonFill, LockFill } from "react-bootstrap-icons";
import { InputGroup } from "react-bootstrap";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const validate = () => {
    const temp = {};

    if (!username.trim()) {
      temp.username = "Username is required";
    }

    if (!password) {
      temp.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      temp.password =
        "Password must be at least 8 chars, include upper, lower, number & special char";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) return;
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentUser", username);
    navigate("/dashboard");
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setErrors({ ...errors, username: "" });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors({ ...errors, password: "" });
  };

  return (
    <div
  className="d-flex justify-content-center align-items-center"
  style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1976d2, #42a5f5)"
  }}
    >
      <Card style={{ width: "380px", borderRadius: "12px" }} className="p-4 shadow">
        <h4 className="text-center mb-4 fw-bold">User Login</h4>

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <PersonFill />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <LockFill />
              </InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 mt-2"
            size="lg"
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>

  );
}

export default Login;
