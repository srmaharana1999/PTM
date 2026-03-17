import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useEffect, Suspense } from "react";
import { initAuth } from "./features/auth/authThunks";
import { useAppDispatch } from "./app/hooks";
import Home from "./pages/Home";
import User from "./components/Dashboard/User";
import CreateTask from "./components/Dashboard/CreateTask";
import OverView from "./components/Dashboard/OverView";
import TaskList from "./components/Dashboard/TaskList";

import HookTester from "./components/HookTester";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/testing" element={<HookTester />} />

      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<OverView />} />
        <Route path="profile" element={<User />} />
        <Route
          path="task_list"
          element={
            <Suspense fallback={<div className="container mx-auto py-10">Loading tasks...</div>}>
              <TaskList />
            </Suspense>
          }
        />
        <Route path="create_task" element={<CreateTask />} />
      </Route>
    </Routes>
  );
}

export default App;
