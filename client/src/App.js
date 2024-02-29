import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import Workspace from "./pages/Workspace/Workspace";
import Project from "./pages/Project/Project";
import Navbar from "./components/Navbar";
import { SignupPage } from "./pages/SignupPage/SignupPage";
import { useAuth } from "./context/auth-context";

function App() {
  const { user } = useAuth()
  return (
    <>
      <Navbar/>
      <Routes>
      <Route path="/" element={<LoginPage/>}/>
      <Route path="/workspaces" element={user ? <Workspace/> : <LoginPage/>}/>
      <Route path="/projects" element={user ?<Project/> : <LoginPage/>}/>
      <Route path="/signup" element={<SignupPage/>}/>
      <Route path="/projects/:id" element={user ?<Project/> : <LoginPage/>}/>
      </Routes>
    </>
  );
}

export default App;
