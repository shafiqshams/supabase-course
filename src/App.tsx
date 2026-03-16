import { type Session } from "@supabase/supabase-js";
import { Auth } from "./pages/Auth";
import TaskManager from "./pages/TaskManager";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  return (
    <>
      <TaskManager />
      <Auth />
    </>
  );
}

export default App;
