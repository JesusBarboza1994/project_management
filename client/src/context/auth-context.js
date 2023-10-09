import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null || JSON.parse(sessionStorage.getItem("user")))
  const [currentProject, setCurrentProject] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [workspaces, setWorkspaces] = useState(null)
  const [projects, setProjects] = useState(null)
  return (
    <AuthContext.Provider
      value={{
        user,
        workspaces,
        currentProject,
        projects,
        setProjects,
        setCurrentProject,
        setWorkspaces,
        showModal,
        setShowModal,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };