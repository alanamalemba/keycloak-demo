import Keycloak, { KeycloakProfile, KeycloakTokenParsed } from "keycloak-js";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KC_URL,
  realm: import.meta.env.VITE_KC_REALM,
  clientId: import.meta.env.VITE_KC_CLIENT_ID,
});
type Props = {
  children: ReactNode;
};
type AuthContextType = {
  isLoggedIn: boolean;
  kcLogout: () => Promise<void>;
  kcToken: string | undefined;
  kcTokenParsed: KeycloakTokenParsed | undefined;
  kcUserProfile: KeycloakProfile | null;
};
export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({ children }: Props) {
  const hasUseEffectRun = useRef(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [kcUserProfile, setKcUserProfile] = useState<KeycloakProfile | null>(
    null
  );
  const kcToken = keycloak.token;
  const kcTokenParsed = keycloak.tokenParsed;

  useEffect(() => {
    if (hasUseEffectRun.current) return;

    hasUseEffectRun.current = true;

    (async function () {
      try {
        const isAuthenticated = await keycloak.init({
          onLoad: "login-required",
        });

        setIsLoggedIn(isAuthenticated);
        // used to get user profile that has payerId if you added it as an attribute
        const userProfile = await keycloak.loadUserProfile();
        setKcUserProfile(userProfile);
      } catch (error) {
        if (error instanceof Error) console.error("Error: ", error.message);
        else console.error("Unknown Error: ", error);
      }
    })();
  }, []);

  async function kcLogout() {
    try {
      await keycloak.logout({
        redirectUri: import.meta.env.VITE_CLIENT_URL,
      });
    } catch (error) {
      if (error instanceof Error) console.error("Error: ", error.message);
      else console.error("Unknown Error: ", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, kcLogout, kcToken, kcTokenParsed, kcUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
