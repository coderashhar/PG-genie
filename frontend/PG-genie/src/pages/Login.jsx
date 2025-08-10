import { useState } from "react";
import { Link } from "react-router-dom"; // Better than <a> for SPA
import loginImage from "../assets/login.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const inputStyles =
    "h-[45px] w-full bg-transparent border-b focus:border-[#934b2a] border-black/20 outline-none mb-5 text-[#40414a]";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("All fields are required!");
      return;
    }
    setError("");
    console.log("Logged in as:", username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ececec] px-4">
      <div className="flex w-full max-w-[950px] h-[580px] bg-white rounded-xl shadow-xl overflow-hidden">
        
        {/* Image section */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={loginImage}
            alt="Login visual"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-8 text-white text-xl font-semibold leading-relaxed drop-shadow-md">
            <p>Your journey begins with</p>
            <p>finding the right place to</p>
            <p>
              stay -{" "}
              <em className="font-bold text-sm">PG Buddy</em>
            </p>
          </div>
        </div>

        {/* Form section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center text-black">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-black">
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputStyles}
            />

            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputStyles}
            />

            <button
              type="submit"
              className="w-full bg-[#ececec] text-black py-2 rounded transition hover:bg-[#533e2d] hover:text-white"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="font-bold hover:underline text-black">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
