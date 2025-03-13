"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiChevronRight,
  FiTrendingUp,
  FiTarget,
  FiClipboard,
  FiDownload,
} from "react-icons/fi";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={`bg-green-700 h-screen p-4 relative transition-all duration-300 select-none ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      {/* Botón de expandir/contraer */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute top-4 right-0 translate-x-1/2 bg-white p-2 rounded-full shadow-md z-50"
      >
        {expanded ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
      </button>

      {/* Logo o título de la aplicación */}
      <div className="flex items-center justify-center mt-6 mb-6">
        <span
          className={`text-white font-bold text-lg transition-all ${
            expanded ? "text-xl opacity-100" : "text-sm opacity-0"
          }`}
        >
          Fintrack
        </span>
      </div>

      {/* Navegación */}
      <nav className="space-y-4">
        <NavItem
          href="/transacciones"
          icon={<FiTrendingUp size={24} />}
          text="Transacciones"
          expanded={expanded}
        />
        <NavItem
          href="/meta-ahorro"
          icon={<FiTarget size={24} />}
          text="Meta de ahorro"
          expanded={expanded}
        />
        <NavItem
          href="/presupuesto"
          icon={<FiClipboard size={24} />}
          text="Presupuesto mensual"
          expanded={expanded}
        />
        <NavItem
          href="/exportar"
          icon={<FiDownload size={24} />}
          text="Exportar"
          expanded={expanded}
        />
      </nav>
    </div>
  );
}

const NavItem = ({ href, icon, text, expanded }) => (
  <Link
    href={href}
    className="flex items-center space-x-3 text-white hover:bg-green-600 p-2 rounded-lg transition"
  >
    {icon}
    {expanded && <span className="text-lg font-medium">{text}</span>}
  </Link>
);
