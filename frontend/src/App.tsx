import Authenticating from "./components/Authenticating";
import Protected from "./components/Protected";
import { useAuthContext } from "./context/Auth";

export default function App() {
  const { isLoggedIn } = useAuthContext();

  return isLoggedIn ? <Protected /> : <Authenticating />;
}
