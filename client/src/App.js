import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import Workspace from "./pages/Workspace/Workspace";
import Project from "./pages/Project/Project";

function App() {
  return (
   <Routes>
    <Route path="/" element={<LoginPage/>}/>
    <Route path="/workspaces" element={<Workspace/>}/>
    <Route path="/projects" element={<Project/>}/>
   </Routes>
  );
}

export default App;
