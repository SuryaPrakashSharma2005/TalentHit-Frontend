import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser, registerUser, sendOtp, verifyOtp } from "@/lib/api";
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

// 🔥 OTP STATES
const [otpSent, setOtpSent] = useState(false);
const [otpVerified, setOtpVerified] = useState(false);
const [otp, setOtp] = useState("");

const [form, setForm] = useState({
email: "",
password: "",
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

// ================= SEND OTP =================
const handleSendOtp = async () => {
if (!form.email) {
toast.error("Enter email first");
return;
}

try {
  await sendOtp(form.email);
  toast.success("OTP sent");
  setOtpSent(true);
} catch (err: any) {
  toast.error(err.message);
}

};

// ================= VERIFY OTP =================
const handleVerifyOtp = async () => {
if (!otp) {
toast.error("Enter OTP");
return;
}


try {
  await verifyOtp(form.email, otp);
  toast.success("OTP verified");
  setOtpVerified(true);
} catch (err: any) {
  toast.error(err.message);
}

};

// ================= SUBMIT =================
const handleSubmit = async () => {
if (!form.email || !form.password) {
toast.error("Please fill all fields");
return;
}

// 🔥 BLOCK SIGNUP WITHOUT OTP
if (!isLogin && !otpVerified) {
  toast.error("Please verify OTP first");
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

  await new Promise((res) => setTimeout(res, 300));
  await refreshUser();

  toast.success(isLogin ? "Login successful" : "Account created");

  navigate(role === "company" ? "/company" : "/applicant");

} catch (err: any) {
  toast.error(err?.message || "Authentication failed");
} finally {
  setLoading(false);
}

};

// ================= GOOGLE LOGIN =================
const handleGoogleLogin = useGoogleLogin({
onSuccess: async (tokenResponse) => {
try {
setGoogleLoading(true);


    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

    const data = await res.json();

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    await refreshUser();

    toast.success("Google login successful");

    navigate(role === "company" ? "/company" : "/applicant");

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

return ( <div className="min-h-screen flex items-center justify-center bg-background px-4"> <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg border">


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

      {/* 🔥 SEND OTP */}
      {!isLogin && !otpSent && (
        <Button onClick={handleSendOtp}>
          Send OTP
        </Button>
      )}

      {/* 🔥 OTP INPUT */}
      {!isLogin && otpSent && !otpVerified && (
        <>
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button onClick={handleVerifyOtp}>
            Verify OTP
          </Button>
        </>
      )}

      <Input
        name="password"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />

      <Button onClick={handleSubmit} disabled={loading}>
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
        onClick={() => {
          setIsLogin(!isLogin);
          setOtpSent(false);
          setOtpVerified(false);
          setOtp("");
        }}
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
      Continue with Google
    </Button>

  </div>
</div>

);
};

export default Auth;
