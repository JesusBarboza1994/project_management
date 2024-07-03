import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import Workspace from "./pages/Workspace/Workspace";
import Project from "./pages/Project/Project";
import Navbar from "./components/Navbar";
import { SignupPage } from "./pages/SignupPage/SignupPage";
import { useAuth } from "./context/auth-context";
import Table from "./pages/Table/Table";

function App() {
  const { user } = useAuth()
  return (
    <>
      <Navbar/>
      <Routes>
        {
          user 
          ?
          <>
            <Route path="/" element={<Workspace/>}/>
            <Route path="/workspaces" element={<Workspace/>}/>
            <Route path="/projects" element={<Project/>}/>
            <Route path="/projects/:id" element={<Project/>}/>
            <Route path="/tables/:id" element={<Table/>}/>        
          </>
          :
          <>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route Component={<LoginPage/>}/>
          </>
        }
      </Routes>
    </>
  );
}

export default App;
