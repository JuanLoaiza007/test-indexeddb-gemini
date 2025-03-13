"use client";
import { useState } from "react";
import { request_gemini } from "@/app/lib/gemini";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { FiRefreshCcw, FiX } from "react-icons/fi";
import { MdAutoFixHigh } from "react-icons/md";

export default function IASuggestion({ transactions }) {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  async function getIASuggestion() {
    if (transactions.length === 0) {
      alert("No hay transacciones para analizar.");
      return;
    }

    setLoading(true);
    setSuggestion("");

    const response = await request_gemini(transactions);
    setSuggestion(response);
    setLoading(false);
    setShowSuggestion(true);
  }

  return (
    <div className="relative w-80">
      {/* Botón flotante para abrir la sugerencia */}
      {!showSuggestion && (
        <button
          onClick={() => setShowSuggestion(true)}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition flex items-center justify-center"
        >
          <MdAutoFixHigh size={24} />
        </button>
      )}

      {/* Contenedor de la sugerencia de IA */}
      {showSuggestion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white shadow-lg p-4 rounded-2xl 
             w-full
             max-h-1/4 overflow-y-auto 
             flex flex-col gap-3 border-3 border-purple-600"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow">
                🤖
              </div>
              <span className="font-medium text-purple-600">Sugerencia IA</span>
            </div>
            <button
              onClick={() => setShowSuggestion(false)}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Contenido de la sugerencia */}
          <div className="bg-gray-200 p-3 rounded-lg text-gray-800 text-sm">
            {loading ? (
              <p className="animate-pulse">Obteniendo sugerencias...</p>
            ) : suggestion ? (
              <Markdown remarkPlugins={[remarkGfm]}>{suggestion}</Markdown>
            ) : (
              <p className="italic">
                Presiona "Generar" para obtener una sugerencia
              </p>
            )}
          </div>

          {/* Botón para regenerar sugerencia */}
          <button
            onClick={getIASuggestion}
            disabled={loading}
            className={`py-2 px-4 rounded-lg flex items-center gap-2 justify-center transition text-center ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            <FiRefreshCcw size={16} />
            {loading ? "Generando..." : "Generar sugerencia"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
