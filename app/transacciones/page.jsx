"use client";
import { useState, useEffect } from "react";
import {
  obtenerTransacciones,
  agregarTransaccion,
  actualizarTransaccion,
  eliminarTransaccion,
} from "@/app/lib/indexedDB";
import { request_gemini } from "@/app/lib/gemini";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function TransaccionesPage() {
  const [transacciones, setTransacciones] = useState([]);
  const [form, setForm] = useState({
    id: "",
    tipo: "Ingreso",
    clasificacion: "",
    descripcion: "",
    categoria: "",
    monto: "",
    fecha: "",
  });
  const [sugerenciaIA, setSugerenciaIA] = useState("");
  const [cargandoIA, setCargandoIA] = useState(false);

  useEffect(() => {
    cargarTransacciones();
  }, []);

  async function cargarTransacciones() {
    const data = await obtenerTransacciones();
    console.log("📂 Transacciones obtenidas:", data);
    setTransacciones(data);
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    if (form.tipo === "Gasto" && !form.clasificacion) {
      alert("Debes seleccionar una clasificación");
      return;
    }

    if (form.id) {
      console.log("🔄 Actualizando transacción:", form);
      await actualizarTransaccion(form);
    } else {
      const nuevaTransaccion = { ...form, id: Date.now() };
      console.log("➕ Agregando transacción:", nuevaTransaccion);
      await agregarTransaccion(nuevaTransaccion);
    }

    setForm({
      id: "",
      tipo: "Ingreso",
      clasificacion: "",
      descripcion: "",
      categoria: "",
      monto: "",
      fecha: "",
    });

    await cargarTransacciones();
  }

  async function manejarEliminar(id) {
    console.log(`🗑️ Eliminando transacción con ID: ${id}`);
    await eliminarTransaccion(id);
    setTransacciones(transacciones.filter((t) => t.id !== id));
  }

  async function manejarEditar(id) {
    const transaccion = transacciones.find((t) => t.id === id);
    console.log("✏️ Editando transacción:", transaccion);
    setForm(transaccion);
  }

  async function obtenerSugerenciaIA() {
    if (transacciones.length === 0) {
      alert("No hay transacciones para analizar.");
      return;
    }

    setCargandoIA(true);
    setSugerenciaIA("");

    const respuesta = await request_gemini(transacciones);
    setSugerenciaIA(respuesta);
    setCargandoIA(false);
  }

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Gestión de Transacciones
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sección del formulario */}
        <form
          onSubmit={manejarEnvio}
          className="bg-gray-100 p-4 rounded-lg shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-2">Nueva Transacción</h2>
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={manejarCambio}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="number"
            name="monto"
            placeholder="Monto"
            value={form.monto}
            onChange={manejarCambio}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            name="categoria"
            placeholder="Categoría"
            value={form.categoria}
            onChange={manejarCambio}
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            name="tipo"
            value={form.tipo}
            onChange={manejarCambio}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="Ingreso">Ingreso</option>
            <option value="Gasto">Gasto</option>
          </select>
          {form.tipo === "Gasto" && (
            <select
              name="clasificacion"
              value={form.clasificacion}
              onChange={manejarCambio}
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="">Seleccionar clasificación</option>
              <option value="esencial">Esencial</option>
              <option value="opcional">Opcional</option>
            </select>
          )}
          <input
            type="datetime-local"
            name="fecha"
            value={form.fecha}
            onChange={manejarCambio}
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            {form.id ? "Actualizar" : "Agregar"}
          </button>
        </form>

        {/* Sección de lista de transacciones */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">
            Historial de Transacciones
          </h2>
          {transacciones.length === 0 ? (
            <p className="text-gray-500 text-center">
              No hay transacciones registradas.
            </p>
          ) : (
            <ul className="space-y-2">
              {transacciones.map((t) => (
                <li
                  key={t.id}
                  className="flex justify-between items-center p-2 bg-gray-100 rounded shadow"
                >
                  <div>
                    <p className="font-semibold">
                      {t.descripcion} - ${t.monto}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t.tipo} - {t.categoria}{" "}
                      {t.clasificacion ? `(${t.clasificacion})` : ""}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => manejarEditar(t.id)}
                      className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => manejarEliminar(t.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Sección de IA */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-lg text-center">
        <button
          onClick={obtenerSugerenciaIA}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
        >
          Obtener sugerencia IA
        </button>
        {cargandoIA && (
          <p className="text-gray-500 text-center mt-2 animate-pulse">
            Obteniendo sugerencias...
          </p>
        )}
        {sugerenciaIA && (
          <div className="mt-4 p-4 bg-white border rounded justify-start items-start text-left">
            <Markdown remarkPlugins={[remarkGfm]}>{sugerenciaIA}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
