import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import Keycloak from "keycloak-connect";
import { KC_REALM, KC_URL } from "./constants/keycloak.js";
import getAdminAccessToken from "./lib/getAdminAccessToken.js";

const app = express();
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

app.use(keycloak.middleware());

// Protected route requiring authentication
app.get("/user-info/:uid", keycloak.protect(), async (req, res) => {
  try {
    const accessToken = await getAdminAccessToken();
    const userId = req.params.uid;

    const response = await fetch(
      `${KC_URL}/admin/realms/${KC_REALM}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) throw new Error(response.statusText);

    const userInfo = await response.json();

    res.status(200).json(userInfo);
  } catch (error) {
    res.status(500).json(error.message);
    console.error(error);
  }
});

// Listen on port 3000
app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
