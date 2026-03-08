import { type SubmitEvent, useEffect, useState } from "react";
import "./App.css";
import supabase from "./lib/supabase";

const initialState = {
  title: "",
  desc: "",
};

interface Task {
  id: number;
  title: string;
  desc: string;
  created_at: string;
}

function App() {
  const [newTask, setNewTask] = useState(initialState);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("tasks").insert(newTask).single();

    if (error) {
      console.error("Error adding task: ", error.message);
      return;
    }

    setNewTask(initialState);
    fetchTasks();
  };

  const handleUpdateTask = async (id: number) => {
    const { error } = await supabase.from("tasks").update(newTask).eq("id", id);

    if (error) {
      console.error("Error updating task: ", error.message);
      return;
    }

    fetchTasks();
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting task: ", error.message);
      return;
    }

    fetchTasks();
  };

    const fetchTasks = async () => {
      const { error, data } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", {
          ascending: true,
        });

      if (error) {
        console.error("Error adding task: ", error.message);
        return;
      }

      setTasks(data);
    };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>Task Manager CRUD</h2>

      {/* Form to add a new task */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Task Title"
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
          onChange={(e) => {
            setNewTask((prev) => ({
              ...prev,
              title: e.target.value,
            }));
          }}
        />
        <textarea
          placeholder="Task Description"
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
          onChange={(e) => {
            setNewTask((prev) => ({
              ...prev,
              desc: e.target.value,
            }));
          }}
        />
        <button
          disabled={!newTask.title || !newTask.desc}
          type="submit"
          style={{ padding: "0.5rem 1rem" }}
        >
          Add Task
        </button>
      </form>

      {/* List of Tasks */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
        <li
            key={task.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <div>
              <h3>{task.title}</h3>
              <p>{task.desc}</p>
            <div>
              <button style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}>
                Edit
              </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  style={{ padding: "0.5rem 1rem" }}
                >
                  Delete
                </button>
            </div>
          </div>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
