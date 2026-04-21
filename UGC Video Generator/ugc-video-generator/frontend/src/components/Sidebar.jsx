import { Link, useLocation } from "react-router-dom";
import { Video, Film, User, Settings } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const Item = ({ to, icon, label }) => (
    <Link
      to={to}
      className={`nav-item ${location.pathname === to ? "active" : ""}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">AI Studio</h1>
      <nav className="nav-menu">
        <Item to="/" icon={<Video size={20} />} label="Create" />
        <Item to="/videos" icon={<Film size={20} />} label="My Videos" />
        <Item to="/actors" icon={<User size={20} />} label="Actors Library" />
        <Item to="/settings" icon={<Settings size={20} />} label="Settings" />
      </nav>
    </aside>
  );
}