import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser, registerUser } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

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

        {/* Google Placeholder */}
        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              window.location.href = `http://127.0.0.1:8000/auth/google?role=${role}`;
            }}
          >
            Continue with Google
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Auth;