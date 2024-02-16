import LoginForm from "./components/login-form";
import { ModeToggle } from "./components/mode-toggle";
import { useEffect } from "react";
import { useLoginStore } from "./lib/LoginStore";
import Home from "./components/home";
import { api } from "./lib/statics";
import { Button } from "./components/ui/button";
// import { CustomKanban } from "./components/CustomKanban";

function App() {
  const { isLoggedIn, initializeFromBackend, setLoggedIn } = useLoginStore();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${api}/auth/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        localStorage.removeItem("username");
        setLoggedIn(false);

        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    initializeFromBackend();
  }, []);
  return (
    <main className="flex min-w-screen min-h-screen h-auto justify-center items-center p-4 ">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      {isLoggedIn === true && (
        <Button onClick={handleLogout} className="absolute top-5 left-5">
          Logout{" "}
        </Button>
      )}

      {isLoggedIn ? <Home></Home> : <LoginForm></LoginForm>}
    </main>
  );
}

export default App;
