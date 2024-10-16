import {
  KC_CLIENT_ID,
  KC_CLIENT_SECRET,
  KC_REALM,
  KC_URL,
} from "../constants/keycloak.js";

export default async function getAdminAccessToken() {
  const data = new URLSearchParams({
    client_id: KC_CLIENT_ID,
    grant_type: "client_credentials",
    client_secret: KC_CLIENT_SECRET,
    scope: "openid",
  });

  try {
    const response = await fetch(
      `${KC_URL}/realms/${KC_REALM}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      }
    );

    if (!response.ok) throw new Error(response.statusText);

    const result = await response.json();
    return result.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error.message || error);
  }
}
