import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldX, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/access-denied")({
  head: () => ({
    meta: [
      { title: "Access Denied — Eventify" },
      { name: "description", content: "You do not have permission to view this page." },
    ],
  }),
  component: AccessDenied,
});

function AccessDenied() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-2xl bg-destructive/10">
        <ShieldX className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-bold text-foreground">Access Denied</h1>
      <p className="mt-3 max-w-md text-base text-muted-foreground">
        You don't have permission to view this page. Please sign in with the right account or go back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Home
          </Link>
        </Button>
        <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
          <Link to="/signin">
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Link>
        </Button>
      </div>
    </div>
  );
}
