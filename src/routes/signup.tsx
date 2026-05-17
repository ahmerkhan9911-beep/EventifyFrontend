import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — Eventify" },
      {
        name: "description",
        content: "Create your Eventify account to start booking and discovering events.",
      },
    ],
  }),
  component: SignUp,
});

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function update<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Full name is required";
    if (!form.email) next.email = "Email is required";
    if (!form.password || form.password.length < 6)
      next.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      next.confirmPassword = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await signup(form.name.trim(), form.email, form.password);
      toast.success("Account created! Welcome to Eventify 🎉");
      navigate({ to: "/events" });
    } catch (error: any) {
      toast.error(error.message || "Sign up failed. Please try again.");
      setErrors({ email: error.message });
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
        eyebrow="Get started"
        title="Create your account"
        description="Join thousands of event lovers — it's free."
      />

      <form
        onSubmit={submit}
        className="mt-10 space-y-5 rounded-3xl border border-border bg-gradient-card p-6 shadow-soft"
      >
        {/* Full Name */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <User className="h-4 w-4 text-primary" /> Full Name
          </label>
          <input
            id="signup-name"
            className={`${inputBase} ${errors.name ? "border-destructive" : "border-input"}`}
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
          />
          {errors.name && (
            <span className="mt-1.5 block text-xs font-medium text-destructive">
              {errors.name}
            </span>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Mail className="h-4 w-4 text-primary" /> Email
          </label>
          <input
            id="signup-email"
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
              id="signup-password"
              className={`${inputBase} ${errors.password ? "border-destructive" : "border-input"}`}
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
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

        {/* Confirm Password */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Lock className="h-4 w-4 text-primary" /> Confirm Password
          </label>
          <div className="relative">
            <input
              id="signup-confirm-password"
              className={`${inputBase} ${
                errors.confirmPassword ? "border-destructive" : "border-input"
              }`}
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="mt-1.5 block text-xs font-medium text-destructive">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        {/* Role note */}
        <p className="rounded-xl bg-secondary px-4 py-2.5 text-xs text-muted-foreground">
          🔒 All new accounts start as <strong>regular users</strong>. Admin access is granted separately.
        </p>

        <Button
          id="signup-submit"
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
        >
          {loading ? "Creating account…" : "Create account"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </section>
  );
}
