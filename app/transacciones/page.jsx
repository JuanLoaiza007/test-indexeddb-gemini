"use client";
import { useState, useEffect } from "react";
import {
  obtenerTransacciones,
  agregarTransaccion,
  actualizarTransaccion,
  eliminarTransaccion,
} from "@/app/lib/indexedDB";

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

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Transacciones</h1>
      <form onSubmit={manejarEnvio} className="bg-gray-100 p-4 rounded-lg mb-4">
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
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {form.id ? "Actualizar" : "Agregar"}
        </button>
      </form>
      <ul className="space-y-2">
        {transacciones.length === 0 ? (
          <p className="text-gray-500 text-center">
            No hay transacciones registradas.
          </p>
        ) : (
          transacciones.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center p-2 bg-white rounded shadow"
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
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  ✏️
                </button>
                <button
                  onClick={() => manejarEliminar(t.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
