import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
    email: string;
    password: string;
  };
  
const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User>({ email: "", password: "" });
    const [error, setError] = useState("");
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUser({ ...user, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await axios.post("https://reqres.in/api/login", {
          email: user.email,
          password: user.password,
        });
  
        console.log(response);
  
        if (response.status === 400) {
          setError("Invalid email or password!");
          return;
        }
  
        localStorage.setItem("currentToken", JSON.stringify(response.data.token)); // Store logged-in user
        navigate("/dashboard"); // Redirect to dashboard
      } catch (err) {
        console.log(err);
      }
    };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
            Login to Your Account
          </h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
  )
}

export default Login