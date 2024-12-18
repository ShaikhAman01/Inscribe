
import { SignupInput } from "@shaikhaman/medium-common";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, useToast } from "./Toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const { showPromiseToast } = useToast();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem('token'); // Check for token
    if (token) {
      navigate('/blogs'); // Redirect to blogs if authenticated
    }
  }, [navigate]);

  async function sendRequest() {
    if (postInputs.password.length < 6) {
      console.log("Sending request with inputs:", postInputs); // Log inputs before sending
      setPasswordError("Password must be at least 6 characters long");
      return; // 
    }
    showPromiseToast(
      async () => {
        const response = await axios.post(
          `${BACKEND_URL}/api/v1/user/${
            type === "signup" ? "signup" : "signin"
          }`,
          postInputs
        );
        console.log("Response data:", response.data);
        if (response.data && response.data.jwt) {
          const { jwt, name } = response.data;
          localStorage.setItem("token", jwt);

          console.log("Name from response:", name);
          if (name) {
            localStorage.setItem("name", name);
          } else {
            console.warn("Name not received from server");
          }

          setTimeout(() => {
            navigate("/blogs");
          }, 1000);
        } else {
          throw new Error("Invalid response from server");
        }
      },
      {
        loading: "Authenticating...",
        success: `Successfully ${
          type === "signup" ? "signed up" : "signed in"
        }!`,
        error: "Authentication failed. Please try again.",
      }
    );
  }
  // Create An Account
  return (
    <div className="h-screen flex justify-center flex-col bg-stone-50">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold text-center text-stone-900">
            {type === "signup"
                ? "Create an Account"
                : "Sign In to Account"}
            </div>
            <div className="text-stone-600 text-center">
              {type === "signup"
                ? "Already Have an Account?"
                : "Don't Have an account?"}
              <Link
                className="underline pl-1"
                to={type == "signup" ? "/signin" : "/signup"}
              >
                {type == "signup" ? "Login" : "signup"}
              </Link>
            </div>
          </div>

          <div className="pt-6">
            {type === "signup" ? (
              <LabelledInput
                label="Name"
                placeholder="John Doe"
                onChange={(e) => {
                  setPostInputs({
                    ...postInputs,
                    name: e.target.value,
                  });
                }}
              />
            ) : null}
            <LabelledInput
              label="Username"
              placeholder="johndoe@gmail.com"
              type={"email"}
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  username: e.target.value,
                });
              }}
            />
            <LabelledInput
              label="Password"
              type={"password"}
              placeholder=""
              onChange={(e) => {
                const password = e.target.value;
                if (password.length < 6) {
                  setPasswordError("Password must be at least 6 characters long");
                } else {
                  setPasswordError(null);
                }
                setPostInputs({
                  ...postInputs,
                  password: password,
                });
              }}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
            <button
              onClick={sendRequest}
              type="button"
              className="w-full mt-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2"
            >
              {type === "signup" ? "Sign up" : "Sign in"}
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
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-md font-semibold text-gray-900  ">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
export default Auth;
