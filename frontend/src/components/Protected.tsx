import { useEffect, useState } from "react";
import { useAuthContext } from "../context/Auth";

export default function Protected() {
  const { kcToken, kcTokenParsed, kcLogout, kcUserProfile } = useAuthContext();
  const [userInfo, setUserInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        if (!kcUserProfile?.id) return;
        setIsLoading(true);

        const response = await fetch(
          `http://localhost:3000/user-info/${kcUserProfile.id}`,
          {
            headers: {
              Authorization: `Bearer ${kcToken}`,
            },
          }
        );

        if (!response.ok) throw new Error(response.statusText);

        setUserInfo(JSON.stringify(await response.json(), null, 4));
      } catch (error) {
        if (error instanceof Error) console.error("Error: ", error);
        else console.error("Unknown Error: ", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [kcUserProfile, kcToken]);

  return (
    <>
      <h1>Protected</h1>
      <button onClick={kcLogout}>Log out</button>

      <h2>User Info from backend:</h2>
      {isLoading ? "Loading..." : <pre>{userInfo || "Error"}</pre>}

      <h2>KC Token:</h2>
      <small>{JSON.stringify(kcToken)}</small>

      <h2>KC Parsed Token:</h2>
      <pre>{JSON.stringify(kcTokenParsed, null, 4)}</pre>

      <h2>KC User Profile:</h2>
      <pre>{JSON.stringify(kcUserProfile, null, 4)}</pre>
    </>
  );
}
