import { type SubmitEvent, useState } from "react";
import "./App.css";
import supabase from "./lib/supabase";

const initialState = {
  title: "",
  desc: "",
};

function App() {
  const [newTask, setNewTask] = useState(initialState);
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("tasks").insert(newTask).single();

    if (error) {
      console.error("Error adding task: ", error.message);
      return;
    }

    setNewTask(initialState);
  };
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
        <li
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <div>
            <h3>Title</h3>
            <p>Description</p>
            <div>
              <button style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}>
                Edit
              </button>
              <button style={{ padding: "0.5rem 1rem" }}>Delete</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default App;