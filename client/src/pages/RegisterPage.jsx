import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    role: "student",
  });
  const { name, email, password, password2, role } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData = { name, email, password, role };
      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          required
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="password"
          name="password2"
          value={password2}
          onChange={onChange}
          placeholder="Confirm Password"
          required
          className="w-full px-4 py-2 border rounded-md"
        />
        <select
          name="role"
          value={role}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
