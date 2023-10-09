import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState({
    username: "",
    email: ""
  })
  const [currentWorkspace, setCurrentWorkspace] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [workspaces, setWorkspaces] = useState(null)
  const [projects, setProjects] = useState(null)
  return (
    <AuthContext.Provider
      value={{
        user,
        workspaces,
        currentWorkspace,
        projects,
        setProjects,
        setCurrentWorkspace,
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