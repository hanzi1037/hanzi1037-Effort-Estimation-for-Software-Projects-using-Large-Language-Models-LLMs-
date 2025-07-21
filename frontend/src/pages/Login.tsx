import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../assets/images/logo-icon-64.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <>
      <section className="relative overflow-hidden h-screen flex items-center bg-[url('/assets/images/bg/bg-ai.png')] bg-no-repeat bg-left bg-cover bg-fixed">
        <div className="absolute inset-0 bg-slate-950/20"></div>
        <div className="container relative">
          <div className="md:flex justify-end">
            <div className="lg:w-1/3 md:w-2/4">
              <div className="rounded shadow bg-white dark:bg-slate-900 p-6">
                <Link to="/">
                  <img src={logo} alt="Logo" />
                </Link>

                <h5 className="mt-6 text-xl font-semibold">Sign in to your account</h5>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <form onSubmit={handleLogin} className="text-start mt-4">
                  <div className="grid grid-cols-1">
                    <div className="mb-4">
                      <label className="font-semibold" htmlFor="LoginEmail">Email Address:</label>
                      <input
                        id="LoginEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input mt-3 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-amber-400 dark:border-gray-800 dark:focus:border-amber-400 focus:ring-0"
                        placeholder="name@example.com"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="font-semibold" htmlFor="LoginPassword">Password:</label>
                      <input
                        id="LoginPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input mt-3 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-amber-400 dark:border-gray-800 dark:focus:border-amber-400 focus:ring-0"
                        placeholder="Password"
                      />
                    </div>

                    <div className="flex justify-between mb-4">
                      <div className="flex items-center mb-0">
                        <input
                          id="RememberMe"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                          className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-amber-400 focus:border-amber-300 focus:ring focus:ring-offset-0 focus:ring-amber-200 focus:ring-opacity-50 cursor-pointer me-2"
                        />
                        <label htmlFor="RememberMe" className="form-checkbox-label text-slate-400 cursor-pointer">
                          Remember me
                        </label>
                      </div>
                      {/* <p className="text-slate-400 mb-0">
                        <Link to="/reset-password" className="text-slate-400">Forgot password?</Link>
                      </p> */}
                    </div>

                    <div className="mb-4">
                      <button
                        type="submit"
                        className="py-2 px-5 inline-block tracking-wide border align-middle duration-500 text-base text-center bg-amber-400 hover:bg-amber-500 border-amber-400 hover:border-amberbg-amber-500 text-white rounded-md w-full"
                      >
                        Login / Sign in
                      </button>
                    </div>

                    {/* <div className="mb-4">
                      <Link
                        to=""
                        className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-gray-800/5 hover:bg-gray-800 border-gray-800/10 hover:border-gray-800 text-gray-800 dark:text-white hover:text-white rounded-md w-full"
                      >
                        <i className="mdi mdi-google mr-2"></i>Sign in with Google
                      </Link>
                    </div> */}

                    <div className="text-center">
                      <span className="text-slate-400 me-2">Don't have an account?</span>
                      <Link to="/signup" className="text-slate-900 dark:text-white font-bold inline-block">
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
