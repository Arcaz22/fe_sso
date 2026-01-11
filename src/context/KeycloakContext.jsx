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

    console.log("🔑 Initializing Keycloak...");
    console.log("Config:", {
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    });

    keycloak
      .init({
        onLoad: "login-required",
        pkceMethod: "S256",
        checkLoginIframe: false,
        enableLogging: true,
        flow: "standard",
      })
      .then((auth) => {
        console.log("✅ Keycloak initialized");
        console.log("Authenticated:", auth);
        console.log("Token present:", !!keycloak.token);

        if (auth && keycloak.token) {
          console.log("Token expires in:", keycloak.tokenParsed?.exp
            ? new Date(keycloak.tokenParsed.exp * 1000).toLocaleString()
            : "N/A");
          console.log("User info:", keycloak.tokenParsed);
        }

        setAuthenticated(auth);
        setInitialized(true);
      })
      .catch((err) => {
        console.error("❌ Keycloak init failed:", err);
        console.error("Error details:", {
          message: err.message,
          status: err.status,
          response: err.response,
        });
        setAuthenticated(false);
        setInitialized(true);
      });

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
