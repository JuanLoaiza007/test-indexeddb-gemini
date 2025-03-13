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
      className={`bg-green-700 h-screen p-4 relative transition-all duration-300 select-none z-50 flex flex-col ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      {/* Botón de expandir/contraer */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute top-4 right-0 translate-x-1/2 bg-white p-2 rounded-full shadow-md z-50 cursor-pointer"
      >
        {expanded ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
      </button>

      {/* Logo o título de la aplicación */}
      <div className="flex items-center justify-center mt-6 mb-6 h-10">
        <span
          className={`text-white font-bold transition-all duration-300 ${
            expanded ? "text-xl opacity-100" : "opacity-0"
          }`}
        >
          Fintrack
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2 flex-grow">
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
    className="flex items-center h-12 px-3 text-white hover:bg-green-600 rounded-lg transition-all duration-300"
  >
    <div className="w-6 flex items-center justify-center">{icon}</div>
    <span
      className={`ml-3 transition-all duration-300 whitespace-nowrap ${
        expanded ? "opacity-100 visible w-auto" : "opacity-0 invisible w-0"
      }`}
    >
      {text}
    </span>
  </Link>
);
