import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import Workspace from "./pages/Workspace/Workspace";
import Project from "./pages/Project/Project";
import Navbar from "./components/Navbar";
import { SignupPage } from "./pages/SignupPage/SignupPage";

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
      <Route path="/" element={<LoginPage/>}/>
      <Route path="/workspaces" element={<Workspace/>}/>
      <Route path="/projects" element={<Project/>}/>
      <Route path="/signup" element={<SignupPage/>}/>
      <Route path="/projects/:id" element={<Project/>}/>
      </Routes>
    </>
  );
}

export default App;
