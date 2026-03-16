import { type Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import supabase from "./lib/supabase";
import { Auth } from "./pages/Auth";
import TaskManager from "./pages/TaskManager";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      console.log(currentSession);
      setSession(currentSession);
    };

    fetchSession();
  }, []);
  return (
    <>
      <TaskManager />
      <Auth />
    </>
  );
}

export default App;
