import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import Workspace from "./pages/Workspace/Workspace";

function App() {
  return (
   <Routes>
    <Route path="/" element={<LoginPage/>}/>
    <Route path="/workspaces" element={<Workspace/>}/>
   </Routes>
  );
}

export default App;
