import { useContext } from "react";
import { AuthContext } from "./AuthContextProvider";

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error(
      "useAuthContext can only be used inside an AuthContextProvider"
    );

  return context;
}
