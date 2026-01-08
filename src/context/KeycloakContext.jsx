import { createContext, useContext, useEffect, useState, useRef } from "react";
import keycloak from "../config/keycloak";

const KeycloakContext = createContext(null);

export const KeycloakProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    console.log("🔑 Initializing Keycloak (DEV MODE)...");

    keycloak
      .init({
        onLoad: "login-required", // ✅ PENTING
        pkceMethod: "S256",
      })
      .then((auth) => {
        console.log("✅ Keycloak initialized");
        console.log("Authenticated:", auth);
        console.log("Access token present:", !!keycloak.token);

        setAuthenticated(auth);
        setInitialized(true);
      })
      .catch((err) => {
        console.error("❌ Keycloak init failed:", err);
        setAuthenticated(false);
        setInitialized(true);
      });

    // Cleanup
    return () => {};
  }, []);

  if (!initialized) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h2>⏳ Initializing authentication...</h2>
      </div>
    );
  }

  return (
    <KeycloakContext.Provider
      value={{
        keycloak,
        authenticated,
      }}
    >
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = () => {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error("useKeycloak must be used within KeycloakProvider");
  }
  return context;
};
