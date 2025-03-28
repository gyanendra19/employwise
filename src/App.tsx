import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { Toaster } from "react-hot-toast";

function App() {
  const route = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
      </>
    )
  );
  return (
    <>
      <RouterProvider router={route} />
      <Toaster />
    </>
  );
}

export default App;
