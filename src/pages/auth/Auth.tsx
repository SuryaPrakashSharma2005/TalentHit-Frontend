import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser, registerUser } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");

  const role =
    roleParam === "company" || roleParam === "applicant"
      ? roleParam
      : "applicant";

  const { refreshUser } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  if (!form.email || !form.password) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    if (isLogin) {
      await loginUser({
        email: form.email,
        password: form.password,
      });
    } else {
      await registerUser({
        email: form.email,
        password: form.password,
        role,
      });
    }

    // 🔥 IMPORTANT: wait for localStorage + state sync
    await new Promise((res) => setTimeout(res, 300));

    await refreshUser();

    toast.success(isLogin ? "Login successful" : "Account created");

    if (role === "company") {
      navigate("/company");
    } else {
      navigate("/applicant");
    }

  } catch (err: any) {
    toast.error(err?.message || "Authentication failed");
  } finally {
    setLoading(false);
  }
};
  const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      setGoogleLoading(true);

      const BASE_URL =
        import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "/api";

      // 🔥 Send access token to backend
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenResponse.access_token,
          role,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Google login failed");
      }

      // 🔥 GET RESPONSE DATA
      const data = await res.json();

      console.log("GOOGLE LOGIN RESPONSE:", data);

      // 🔥 STORE TOKENS (MOST IMPORTANT FIX)
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // 🔥 NOW LOAD USER
      await refreshUser();

      toast.success("Google login successful");

      if (role === "company") {
        navigate("/company");
      } else {
        navigate("/applicant");
      }

    } catch (err: any) {
      toast.error(err?.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  },
  onError: () => {
    toast.error("Google login failed");
  },
});

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg border">

        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"} —{" "}
          <span className="capitalize">{role}</span>
        </h2>

        <div className="space-y-4">
          <Input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </Button>
        </div>

        {/* Toggle */}
        <div className="mt-6 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-primary font-medium hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google Login */}
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={() => handleGoogleLogin()}
          disabled={googleLoading}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {googleLoading ? "Please wait..." : "Continue with Google"}
        </Button>

      </div>
    </div>
  );
};

export default Auth;