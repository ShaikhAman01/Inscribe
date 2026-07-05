import { SignupInput } from "@shaikhaman/medium-common";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, useToast } from "./Toast";
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const { showPromiseToast } = useToast();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/blogs");
    }
  }, [navigate]);

  async function sendRequest() {
    if (postInputs.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    setIsSubmitting(true);
    showPromiseToast(
      async () => {
        try {
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
        } finally {
          setIsSubmitting(false);
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
    <div className="min-h-screen flex justify-center flex-col bg-stone-50 py-12">
      <div className="flex justify-center">
        <div className="w-full max-w-md px-6 sm:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {type === "signup" ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-stone-500 mt-3 font-medium">
              {type === "signup" ? "Already have an account?" : "New to Inscribe?"}
              <Link
                className="underline pl-1 text-stone-900 font-bold rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                to={type === "signup" ? "/signin" : "/signup"}
              >
                {type === "signup" ? "Log in" : "Create one"}
              </Link>
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              sendRequest();
            }}
          >
            {type === "signup" && (
              <LabelledInput
                id="name"
                label="Name"
                placeholder="John Doe"
                autoComplete="name"
                icon={<User className="w-4 h-4" />}
                onChange={(e) => setPostInputs({ ...postInputs, name: e.target.value })}
              />
            )}
            <LabelledInput
              id="email"
              label="Email"
              placeholder="name@example.com"
              type="email"
              autoComplete="email"
              icon={<Mail className="w-4 h-4" />}
              onChange={(e) => setPostInputs({ ...postInputs, username: e.target.value })}
            />
            <div className="relative">
              <LabelledInput
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete={type === "signup" ? "new-password" : "current-password"}
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
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-[38px] text-stone-400 hover:text-stone-600 transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
              >
                {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
              </button>
            </div>

            {passwordError && (
              <p role="alert" className="text-red-500 text-xs font-bold uppercase tracking-wider">
                {passwordError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 inline-flex items-center justify-center gap-2 text-white bg-stone-900 hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-200 font-bold rounded-xl text-md px-5 py-4 transition-all active:scale-[0.98] shadow-lg shadow-stone-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />}
              {type === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

interface LabelledInputType {
  id: string;
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
  autoComplete?: string;
}

function LabelledInput({ id, label, placeholder, onChange, type, icon, autoComplete }: LabelledInputType) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block mb-2 text-xs font-black uppercase tracking-widest text-stone-500">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-stone-400" aria-hidden="true">
            {icon}
          </div>
        )}
        <input
          id={id}
          onChange={onChange}
          type={type || "text"}
          autoComplete={autoComplete}
          className={`bg-white border border-stone-200 text-stone-900 text-sm rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent block w-full ${icon ? 'pl-10' : 'pl-4'} p-3 transition-all placeholder-stone-300`}
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}

export default Auth;
