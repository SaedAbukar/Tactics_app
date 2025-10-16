import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./routes/home/Home";
import { ApiTacticalEditor } from "./routes/tactical_editor/ApiTacticalEditor";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import Profile from "./routes/profile/Profile";
import AuthForm from "./components/authForm/AuthForm";
import { Exercises } from "./components/exercises/Exercises";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="exercises" element={<Exercises />} />
            <Route path="tacticalEditor" element={<ApiTacticalEditor />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="login" element={<AuthForm />} />
        </Route>
      </Routes>
    </Router>
  );
}
