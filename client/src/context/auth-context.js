import { createContext, useContext } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
 
  return (
    <AuthContext.Provider
      value={{
      
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