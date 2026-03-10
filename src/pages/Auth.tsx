import { type ChangeEvent, type SubmitEvent, useState } from "react";
import "../App.css";

export const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <h2 className="title">{isSignUp ? "Create Account" : "Welcome Back"}</h2>

      <div className="task-form">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            className="input-field"
            required
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ marginBottom: "1rem" }}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
          }}
          className="btn btn-outline w-full"
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};
