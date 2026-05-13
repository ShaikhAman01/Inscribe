import { SignupInput } from "@shaikhaman/medium-common";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, useToast } from "./Toast";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react"; // Icons for better UI

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const { showPromiseToast } = useToast();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // Eye toggle state
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/blogs');
    }
  }, [navigate]);

  async function sendRequest() {
    if (postInputs.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    showPromiseToast(
      async () => {
        const response = await axios.post(
          `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
          postInputs
        );
        if (response.data && response.data.jwt) {
          const { jwt, name } = response.data;
          localStorage.setItem("token", jwt);
          if (name) localStorage.setItem("name", name);
          setTimeout(() => navigate("/blogs"), 1000);
        } else {
          throw new Error("Invalid response");
        }
      },
      {
        loading: "Authenticating...",
        success: `Successfully ${type === "signup" ? "signed up" : "signed in"}!`,
        error: "Authentication failed. Check your credentials.",
      }
    );
  }

  return (
    <div className="h-screen flex justify-center flex-col bg-stone-50">
      <div className="flex justify-center">
        <div className="w-full max-w-md px-8">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-stone-900 tracking-tight">
              {type === "signup" ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-stone-500 mt-3 font-medium">
              {type === "signup" ? "Already have an account?" : "New to Inscribe?"}
              <Link
                className="underline pl-1 text-stone-900 font-bold"
                to={type === "signup" ? "/signin" : "/signup"}
              >
                {type === "signup" ? "Log in" : "Create one"}
              </Link>
            </p>
          </div>

          <div className="space-y-4">
            {type === "signup" && (
              <LabelledInput
                label="Name"
                placeholder="John Doe"
                icon={<User className="w-4 h-4" />}
                onChange={(e) => setPostInputs({ ...postInputs, name: e.target.value })}
              />
            )}
            <LabelledInput
              label="Email"
              placeholder="name@example.com"
              type="email"
              icon={<Mail className="w-4 h-4" />}
              onChange={(e) => setPostInputs({ ...postInputs, username: e.target.value })}
            />
            <div className="relative">
              <LabelledInput
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                onChange={(e) => {
                  const val = e.target.value;
                  setPasswordError(val.length < 6 ? "Minimum 6 characters" : null);
                  setPostInputs({ ...postInputs, password: val });
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-stone-400 hover:text-stone-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {passwordError && (
              <p className="text-red-500 text-xs font-bold uppercase tracking-wider animate-pulse">
                {passwordError}
              </p>
            )}

            <button
              onClick={sendRequest}
              type="button"
              className="w-full mt-6 text-white bg-stone-900 hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-200 font-bold rounded-xl text-md px-5 py-4 transition-all active:scale-[0.98] shadow-lg shadow-stone-200"
            >
              {type === "signup" ? "Create account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
}

function LabelledInput({ label, placeholder, onChange, type, icon }: LabelledInputType) {
  return (
    <div className="w-full">
      <label className="block mb-2 text-xs font-black uppercase tracking-widest text-stone-500">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-stone-400">
            {icon}
          </div>
        )}
        <input
          onChange={onChange}
          type={type || "text"}
          className={`bg-white border border-stone-200 text-stone-900 text-sm rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent block w-full ${icon ? 'pl-10' : 'pl-4'} p-3 transition-all placeholder-stone-300`}
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}

export default Auth;