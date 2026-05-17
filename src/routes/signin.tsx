import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In — Eventify" },
      {
        name: "description",
        content: "Sign in to your Eventify account to manage your events and bookings.",
      },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = { email: "", password: "" };
    if (!form.email) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    if (next.email || next.password) return;

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}! 👋`);
      // Redirect based on role
      if (user.role === "admin") {
        navigate({ to: "/dashboard" });
      } else {
        navigate({ to: "/events" });
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
      setErrors((e) => ({ ...e, email: error.message || "Sign in failed" }));
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <section className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
      <Logo className="justify-center mb-8" />
      <SectionHeading
        align="center"
        eyebrow="Welcome back"
        title="Sign in to your account"
        description="Enter your credentials to access your account."
      />

      <form
        onSubmit={submit}
        className="mt-10 space-y-6 rounded-3xl border border-border bg-gradient-card p-6 shadow-soft"
      >
        {/* Email */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Mail className="h-4 w-4 text-primary" /> Email
          </label>
          <input
            id="signin-email"
            className={`${inputBase} ${errors.email ? "border-destructive" : "border-input"}`}
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && (
            <span className="mt-1.5 block text-xs font-medium text-destructive">
              {errors.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Lock className="h-4 w-4 text-primary" /> Password
          </label>
          <div className="relative">
            <input
              id="signin-password"
              className={`${inputBase} ${errors.password ? "border-destructive" : "border-input"}`}
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <span className="mt-1.5 block text-xs font-medium text-destructive">
              {errors.password}
            </span>
          )}
        </div>

        <Button
          id="signin-submit"
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </section>
  );
}
