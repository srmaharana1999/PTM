import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useEffect } from "react";
import { initAuth } from "./features/auth/authThunks";
import { useAppDispatch } from "./app/hooks";
import Home from "./pages/Home";

function App() {
  const dispatch = useAppDispatch();
  useEffect(()=>{
    dispatch(initAuth())
  },[dispatch])
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
