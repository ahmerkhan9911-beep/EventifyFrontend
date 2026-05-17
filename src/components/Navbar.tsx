import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Menu,
  X,
  LogOut,
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  User,
  ChevronDown,
  Settings,
  Info,
  Image,
  Phone,
  Grid3X3,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

const NAV_CATEGORIES = [
  { name: "Wedding", icon: "💍", color: "text-pink-500" },
  { name: "Birthday", icon: "🎂", color: "text-orange-500" },
  { name: "Sports", icon: "⚽", color: "text-emerald-500" },
  { name: "Tech", icon: "💻", color: "text-blue-500" },
  { name: "Entertainment", icon: "🎭", color: "text-purple-500" },
  { name: "Music", icon: "🎵", color: "text-rose-500" },
  { name: "Business", icon: "💼", color: "text-amber-500" },
];

const PUBLIC_LINKS = [
  { to: "/", label: "Home", exact: true },
  { to: "/events", label: "Events", exact: false },
  { to: "/about", label: "About", exact: false },
  { to: "/gallery", label: "Gallery", exact: false },
  { to: "/contact", label: "Contact", exact: false },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    logout();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
    setMobileOpen(false);
    setProfileOpen(false);
  }

  function navigateCategory(cat: string) {
    sessionStorage.setItem("eventify_filter_category", cat);
    navigate({ to: "/events" });
    setCatOpen(false);
    setMobileOpen(false);
  }

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo className="mr-4" />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {PUBLIC_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact }}
              activeProps={{ className: "text-foreground bg-secondary" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              {l.label}
            </Link>
          ))}

          {/* Categories Dropdown */}
          <div className="relative" ref={catRef}>
            <button
              onClick={() => setCatOpen((v) => !v)}
              className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${catOpen ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Grid3X3 className="h-3.5 w-3.5" />
              Categories
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-elevated animate-fade-in-up">
                {NAV_CATEGORIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => navigateCategory(c.name)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left hover:bg-secondary transition-colors"
                  >
                    <span className="text-lg">{c.icon}</span>
                    <span className="font-medium text-foreground">{c.name}</span>
                  </button>
                ))}
                <div className="mt-1 border-t border-border pt-1">
                  <Link
                    to="/categories"
                    onClick={() => setCatOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    View all categories
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Logged-in normal user extra link */}
          {isLoggedIn && !isAdmin && (
            <Link
              to="/my-bookings"
              activeProps={{ className: "text-foreground bg-secondary" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              My Bookings
            </Link>
          )}

          {/* Admin links */}
          {isAdmin && (
            <>
              <Link
                to="/create"
                activeProps={{ className: "text-foreground bg-secondary" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                className="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Create Event
              </Link>
              <Link
                to="/dashboard"
                activeProps={{ className: "text-foreground bg-secondary" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                className="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Dashboard
              </Link>
            </>
          )}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-2 md:flex">
          {!isLoggedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/signin">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
                <Link to="/signup">
                  <Calendar className="mr-1 h-4 w-4" /> Sign up
                </Link>
              </Button>
            </>
          ) : (
            /* Profile Dropdown */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1.5 transition hover:bg-secondary"
              >
                <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">
                  {initials ?? "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium leading-none">{user?.name?.split(" ")[0]}</p>
                </div>
                {isAdmin && (
                  <span className="hidden sm:block rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                    Admin
                  </span>
                )}
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-border bg-card p-2 shadow-elevated animate-fade-in-up">
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  {!isAdmin && (
                    <>
                      <DropdownItem icon={User} label="My Profile" to="/profile" onClick={() => setProfileOpen(false)} />
                      <DropdownItem icon={BookOpen} label="My Bookings" to="/my-bookings" onClick={() => setProfileOpen(false)} />
                      <DropdownItem icon={Settings} label="Settings" to="/profile" onClick={() => setProfileOpen(false)} />
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" onClick={() => setProfileOpen(false)} />
                      <DropdownItem icon={PlusCircle} label="Create Event" to="/create" onClick={() => setProfileOpen(false)} />
                    </>
                  )}
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-border md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden max-h-[80vh] overflow-y-auto">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {/* Public links */}
            {PUBLIC_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                activeOptions={{ exact: l.exact }}
                activeProps={{ className: "bg-secondary text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="rounded-lg px-3 py-2.5 text-sm font-medium"
              >
                {l.label}
              </Link>
            ))}

            {/* Mobile Categories */}
            <div className="mt-1">
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-1">
                {NAV_CATEGORIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => navigateCategory(c.name)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-left"
                  >
                    <span>{c.icon}</span> {c.name}
                  </button>
                ))}
              </div>
            </div>

            {isLoggedIn && !isAdmin && (
              <Link
                to="/my-bookings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"
              >
                <BookOpen className="h-4 w-4" /> My Bookings
              </Link>
            )}
            {isAdmin && (
              <>
                <Link to="/create" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"><PlusCircle className="h-4 w-4" /> Create Event</Link>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
              </>
            )}

            <div className="mt-3 border-t border-border pt-3">
              {!isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild onClick={() => setMobileOpen(false)}><Link to="/signin">Sign in</Link></Button>
                  <Button asChild className="bg-gradient-primary text-primary-foreground" onClick={() => setMobileOpen(false)}><Link to="/signup">Sign up</Link></Button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-2.5 mb-2">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">{initials}</div>
                    <div>
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>
                  {!isAdmin && (
                    <>
                      <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"><User className="h-4 w-4" /> My Profile</Link>
                      <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"><BookOpen className="h-4 w-4" /> My Bookings</Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

// Helper component
function DropdownItem({ icon: Icon, label, to, onClick }: { icon: any; label: string; to: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
    </Link>
  );
}
