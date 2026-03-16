import type { Session } from "@supabase/supabase-js";
import { type SubmitEvent, useEffect, useState } from "react";
import "../App.css";
import supabase from "../lib/supabase";

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

function TaskManager({ session }: { session: Session }) {
  const [newTask, setNewTask] = useState(initialState);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState(initialState);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const { error, data } = await supabase
      .from("tasks")
      .insert({ ...newTask, email: session?.user?.email })
      .select()
      .single();

    if (error) {
      console.error("Error adding task: ", error.message);
      return;
    }

    setTasks((prev) => [data, ...prev]);
    setNewTask(initialState);
  };

  const handleUpdateTask = async (id: number) => {
    const { error, data } = await supabase
      .from("tasks")
      .update(editingTask)
      .eq("id", id)
      .select()
      .single();

    if (error) return console.error("Error updating task: ", error.message);

    setTasks((prev) => prev.map((task) => (task.id === id ? data : task)));
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) return console.error("Error deleting task: ", error.message);

    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const { error, data } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) return console.error("Error fetching task: ", error.message);

      setTasks(data);
    };

    fetchTasks();
  }, []);

  return (
    <div className="container">
      <h2 className="title">Task Manager</h2>

      {/* Form to add a new task */}
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="What needs to be done?"
          className="input-field"
          onChange={(e) => {
            setNewTask((prev) => ({
              ...prev,
              title: e.target.value,
            }));
          }}
          value={newTask.title}
        />
        <textarea
          placeholder="Add some details..."
          className="input-field"
          style={{ minHeight: "100px", resize: "vertical" }}
          onChange={(e) => {
            setNewTask((prev) => ({
              ...prev,
              desc: e.target.value,
            }));
          }}
          value={newTask.desc}
        />
        <button
          disabled={!newTask.title || !newTask.desc}
          type="submit"
          className="btn btn-primary w-full"
        >
          Add New Task
        </button>
      </form>

      {/* List of Tasks */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-content">
              {editTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editingTask.title}
                    className="input-field"
                    onChange={(e) => {
                      setEditingTask((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }));
                    }}
                  />
                  <textarea
                    className="input-field"
                    style={{ minHeight: "80px", resize: "vertical" }}
                    value={editingTask.desc}
                    onChange={(e) => {
                      setEditingTask((prev) => ({
                        ...prev,
                        desc: e.target.value,
                      }));
                    }}
                  />
                </>
              ) : (
                <>
                  <h3>{task.title}</h3>
                  <p>{task.desc}</p>
                </>
              )}
              <div className="button-group">
                {editTaskId === task.id ? (
                  <>
                    <button
                      onClick={() => {
                        handleUpdateTask(task.id);
                        setEditTaskId(null);
                      }}
                      className="btn btn-primary"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditTaskId(null);
                        setEditingTask(initialState);
                      }}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditTaskId(task.id);
                        setEditingTask(task);
                      }}
                      className="btn btn-outline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
