export default function TransactionForm({ form, handleChange, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-lg font-semibold mb-2 select-none">
        {form.id ? "Editar" : "Nueva"} Transacción
      </h2>
      <input
        type="text"
        name="description"
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="number"
        name="amount"
        placeholder="Monto"
        value={form.amount}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        name="category"
        placeholder="Categoría"
        value={form.category}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
      />
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="Ingreso">Ingreso</option>
        <option value="Gasto">Gasto</option>
      </select>
      {form.type === "Gasto" && (
        <select
          name="classification"
          value={form.classification}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="">Seleccionar clasificación</option>
          <option value="esencial">Esencial</option>
          <option value="opcional">Opcional</option>
        </select>
      )}
      <input
        type="datetime-local"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
      >
        {form.id ? "Actualizar" : "Agregar"}
      </button>
    </form>
  );
}
