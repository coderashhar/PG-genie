import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      console.error("All fields are necessary to proceed!");
    } else {
      console.log("Form submitted", { email, password });
    }
  };

return(
<div className="min-h-screen w-full flex items-center justify-center bg-indigo-200 px-4">
  <div className="bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-[3px] rounded-2xl shadow-xl w-full max-w-md">    <div className="bg-white rounded-[14px] p-8 sm:p-10 md:p-12">
      <h2 className="text-3xl font-extrabold text-center text-indigo-600">
        Welcome Back to PG-Genie 🏠
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
        <div className="flex flex-col gap-2 items-start">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
            required
          />
        </div>

        <div className="flex flex-col gap-2 items-start">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition duration-300"
        >
          Log In
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don’t have an account?{" "}
        <a
          href="/signup"
          className="text-indigo-600 hover:underline font-medium"
        >
          Sign up
        </a>
      </p>
    </div>
  </div>
</div>
)}

export default Login