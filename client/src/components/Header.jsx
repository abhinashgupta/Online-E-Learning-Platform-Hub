import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div className="logo">
        <Link to="/" className="text-2xl font-bold">
          eLearning
        </Link>
      </div>
      <ul className="flex items-center gap-4">
        {user ? (
          <>
            <li>
              <span className="font-bold">Welcome, {user.name}</span>
            </li>
            {user.role === "instructor" && (
              <li>
                <Link to="/dashboard">My Dashboard</Link>
              </li>
            )}
            <li>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={onLogout}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
