import { useState } from "react";
import loginImage from '../assets/login.jpg';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      console.error("All fields are necessary!");
    } else {
      console.log("Logged in as:", username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ececec] px-4">
      <div className="flex w-full max-w-[950px] h-[580px] bg-white rounded-xl shadow-xl overflow-hidden">

        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={loginImage}
            alt="Login visual"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-30 text-white text-xl font-semibold leading-relaxed drop-shadow-md">
            <p>Your journey begins with</p>
            <p>finding the right place to</p>
            <p>stay - <em className="font-bold text-sm">PG Buddy</em></p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-15 flex flex-col justify-center text-black">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6 text-black">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-[45px] w-full bg-transparent border-b focus:border-[#934b2a] border-black/20 outline-none mb-5 text-[#40414a]"
              />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[45px] w-full bg-transparent border-b focus:border-[#934b2a] border-black/20 outline-none mb-5 text-[#40414a]"
            />

            <button
              type="submit"
              className="w-full !bg-[#ececec] text-black py-2 rounded hover:bg-brown transition hover:!bg-[#533e2d] hover:!text-[#fff]"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <a href="/register" className="!font-bold hover:!underline !text-black">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;