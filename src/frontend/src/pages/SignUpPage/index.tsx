import LangflowLogo from "@/assets/LangflowLogo.png?react";
import InputComponent from "@/components/core/parameterRenderComponent/components/inputComponent";
import { useAddUser } from "@/controllers/API/queries/auth";
import { CustomLink } from "@/customization/components/custom-link";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import { track } from "@/customization/utils/analytics";
import * as Form from "@radix-ui/react-form";
import { FormEvent, useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaCheck, FaExclamationTriangle, FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { SIGNUP_ERROR_ALERT } from "../../constants/alerts_constants";
import {
  CONTROL_INPUT_STATE,
  SIGN_UP_SUCCESS,
} from "../../constants/constants";
import useAlertStore from "../../stores/alertStore";
import type {
  inputHandlerEventType,
  signUpInputStateType,
  UserInputType,
} from "../../types/components";

export default function SignUp(): JSX.Element {
  const [inputState, setInputState] =
    useState<signUpInputStateType>(CONTROL_INPUT_STATE);
  const [isDisabled, setDisableBtn] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<{ username: boolean; password: boolean; cnfPassword: boolean }>({ 
    username: false, 
    password: false, 
    cnfPassword: false 
  });

  const { password, cnfPassword, username } = inputState;
  const setSuccessData = useAlertStore((state) => state.setSuccessData);
  const setErrorData = useAlertStore((state) => state.setErrorData);
  const navigate = useCustomNavigate();

  const { mutate: mutateAddUser } = useAddUser();

  function handleInput({
    target: { name, value },
  }: inputHandlerEventType): void {
    setInputState((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  useEffect(() => {
    if (password !== cnfPassword) return setDisableBtn(true);
    if (password === "" || cnfPassword === "") return setDisableBtn(true);
    if (username === "") return setDisableBtn(true);
    setDisableBtn(false);
  }, [password, cnfPassword, username, handleInput]);

  function handleSignup(): void {
    setIsLoading(true);
    const { username, password } = inputState;
    const newUser: UserInputType = {
      username: username.trim(),
      password: password.trim(),
    };

    mutateAddUser(newUser, {
      onSuccess: (user) => {
        track("User Signed Up", user);
        setSuccessData({
          title: SIGN_UP_SUCCESS,
        });
        navigate("/login");
      },
      onError: (error) => {
        setIsLoading(false);
        const {
          response: {
            data: { detail },
          },
        } = error;
        setErrorData({
          title: SIGNUP_ERROR_ALERT,
          list: [detail],
        });
      },
    });
  }

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const isEmailValid = validateEmail(username);
  const isPasswordValid = password.trim().length >= 8;
  const isConfirmPasswordValid = password === cnfPassword && cnfPassword.trim().length > 0;
  const canSubmit = isEmailValid && isPasswordValid && isConfirmPasswordValid && !isLoading;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500/15 rounded-full blur-lg"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 border border-white/20">
                <img src={LangflowLogo} alt="Sochflow Logo" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Sochflow
                </h1>
                <p className="text-purple-200 text-sm">Enterprise AI Platform</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Join the Future of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                AI Development
              </span>
            </h2>
            
            <p className="text-lg text-purple-100 mb-8 leading-relaxed">
              Start building powerful AI applications with enterprise-grade tools, 
              security, and collaboration features designed for modern teams.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                  <FaCheck className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-purple-100">Free to get started</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                  <FaCheck className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-purple-100">No credit card required</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                  <FaCheck className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-purple-100">Instant access to all features</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center">
              <div className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <img src={LangflowLogo} alt="Sochflow Logo" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sochflow</h1>
                <p className="text-gray-500 text-sm">Enterprise AI Platform</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 w-full backdrop-blur-sm rounded-3xl border border-white/20 p-8 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-indigo-50/20 rounded-3xl"></div>
            
            {/* Content wrapper */}
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
                <p className="text-gray-600">Join thousands of developers building AI applications</p>
              </div>

              <Form.Root
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  if (!canSubmit) {
                    event.preventDefault();
                    setTouched({ username: true, password: true, cnfPassword: true });
                    return;
                  }
                  handleSignup();
                  const data = Object.fromEntries(new FormData(event.currentTarget));
                  event.preventDefault();
                }}
                className="space-y-6"
              >
                <Form.Field name="username">
                  <Form.Label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </Form.Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="email"
                      onChange={({ target: { value } }) => {
                        handleInput({ target: { name: "username", value } });
                      }}
                      value={username}
                      className="w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      required
                      placeholder="Enter your email"
                      onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
                    />
                  </div>
                  {touched.username && !isEmailValid && (
                    <div className="flex items-center mt-2 text-sm text-red-600">
                      <FaExclamationTriangle className="w-4 h-4 mr-1" />
                      Please enter a valid email address
                    </div>
                  )}
                </Form.Field>

                <Form.Field name="password">
                  <Form.Label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </Form.Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <InputComponent
                      onChange={(value) => {
                        handleInput({ target: { name: "password", value } });
                      }}
                      value={password}
                      isForm
                      password={!showPassword}
                      required
                      placeholder="Create a password"
                      className="w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {touched.password && !isPasswordValid && (
                    <div className="flex items-center mt-2 text-sm text-red-600">
                      <FaExclamationTriangle className="w-4 h-4 mr-1" />
                      Password must be at least 8 characters long
                    </div>
                  )}
                </Form.Field>

                <Form.Field name="confirmpassword">
                  <Form.Label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </Form.Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <InputComponent
                      onChange={(value) => {
                        handleInput({ target: { name: "cnfPassword", value } });
                      }}
                      value={cnfPassword}
                      isForm
                      password={!showConfirmPassword}
                      required
                      placeholder="Confirm your password"
                      className="w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      onBlur={() => setTouched((prev) => ({ ...prev, cnfPassword: true }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {touched.cnfPassword && !isConfirmPasswordValid && (
                    <div className="flex items-center mt-2 text-sm text-red-600">
                      <FaExclamationTriangle className="w-4 h-4 mr-1" />
                      Passwords do not match
                    </div>
                  )}
                </Form.Field>

                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                    required
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <Form.Submit asChild>
                  <Button
                    disabled={!canSubmit}
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </Form.Submit>
              </Form.Root>

              <div className="mt-8 text-center">
                <CustomLink to="/login">
                  <Button 
                    className="w-full bg-gray-50/80 backdrop-blur-sm text-gray-700 font-medium py-3 rounded-xl border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200" 
                    variant="outline" 
                    type="button"
                  >
                    Already have an account? <span className="font-semibold text-indigo-600 ml-1">Sign in</span>
                  </Button>
                </CustomLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
