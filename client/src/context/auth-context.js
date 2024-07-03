import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null || JSON.parse(sessionStorage.getItem("user")))
  const [currentProject, setCurrentProject] = useState(null || JSON.parse(sessionStorage.getItem("currentProject")))
  const [showModal, setShowModal] = useState(false)
  const [currentActivity, setCurrentActivity] = useState(null)
  const [workspaces, setWorkspaces] = useState(null)
  const [projects, setProjects] = useState(null)
  const [favoriteProjects, setFavoriteProjects] = useState([])
  const [updateWorkspace, setUpdateWorkspace] = useState(false)
  const [updateSubActivities, setUpdateSubActivities] = useState(false)
  const [showModalShared, setShowModalShared ] = useState(false)
  const [sharedProjects, setSharedProjects] = useState([])
  const [trashedProjects, setTrashedProjects] = useState([])
  const [updateListActivites, setUpdateListActivities] = useState(false)
  const [listAllUsers, setListAllUsers] = useState([])
  const [listCollaborators, setListCollaborators] = useState([])
  const [filters, setFilters] = useState({progress:0})
  const [isMixedSharedProject, setIsMixedSharedProject] = useState(false)
  const [tableActivities, setTableActivities] = useState(JSON.parse(sessionStorage.getItem("tableActivities")))
  return (
    <AuthContext.Provider
      value={{
        user,
        workspaces,
        listCollaborators,
        setIsMixedSharedProject,
        isMixedSharedProject,
        setListCollaborators,
        tableActivities,
        setTableActivities,
        trashedProjects,
        setTrashedProjects,
        filters,
        currentActivity,
        setCurrentActivity,
        setFilters,
        showModalShared,
        sharedProjects,
        setSharedProjects,
        listAllUsers,
        setListAllUsers,
        setShowModalShared,
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