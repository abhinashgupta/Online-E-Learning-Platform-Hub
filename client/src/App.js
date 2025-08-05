import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateCourse from "./pages/CreateCourse";
import EditCoursePage from "./pages/EditCoursePage";
import MyCoursesPage from "./pages/MyCoursesPage"; // This is the only dashboard you need
// import Dashboard from "./pages/Dashboard"; // <-- DELETE THIS LINE

function App() {
  return (
    <>
      <Router>
        <div className="container mx-auto px-4">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Ensure this route correctly points to MyCoursesPage */}
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<MyCoursesPage />} />
            </Route>

            <Route path="/create-course" element={<PrivateRoute />}>
              <Route path="/create-course" element={<CreateCourse />} />
            </Route>

            <Route path="/edit-course/:id" element={<PrivateRoute />}>
              <Route path="/edit-course/:id" element={<EditCoursePage />} />
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
