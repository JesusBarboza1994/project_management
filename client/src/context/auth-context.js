import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null || JSON.parse(sessionStorage.getItem("user")))
  const [currentProject, setCurrentProject] = useState(null || sessionStorage.getItem("currentProject"))
  const [showModal, setShowModal] = useState(false)
  const [workspaces, setWorkspaces] = useState(null)
  const [projects, setProjects] = useState(null)
  const [favoriteProjects, setFavoriteProjects] = useState([])
  const [updateWorkspace, setUpdateWorkspace] = useState(false)
  const [updateSubActivities, setUpdateSubActivities] = useState(false)
  const [updateListActivites, setUpdateListActivities] = useState(false)
  return (
    <AuthContext.Provider
      value={{
        user,
        workspaces,
        currentProject,
        projects,
        updateListActivites,
        updateSubActivities,
        updateWorkspace,
        favoriteProjects,
        setFavoriteProjects,
        setUpdateWorkspace,
        setUpdateSubActivities,
        setUpdateListActivities,
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