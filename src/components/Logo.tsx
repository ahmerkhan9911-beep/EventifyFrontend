import { Link } from "@tanstack/react-router";

interface LogoProps {
  className?: string;
  imageClassName?: string;
}

export function Logo({ className = "", imageClassName = "w-32 sm:w-36 -my-3 sm:-my-4" }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center shrink-0 ${className}`}>
      <img
        src="/logo.png"
        alt="Eventify"
        className={`h-auto drop-shadow-md transition-transform hover:scale-105 ${imageClassName}`}
      />
    </Link>
  );
}
