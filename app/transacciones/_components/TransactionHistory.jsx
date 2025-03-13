import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function TransactionHistory({
  transactions,
  handleEdit,
  handleDelete,
}) {
  return (
    <div className="p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2 text-center items-center">
        Historial de Transacciones
      </h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center">
          No hay transacciones registradas.
        </p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center p-2 bg-gray-200 rounded-lg px-8 py-4 shadow"
            >
              <div>
                <p className="font-semibold">
                  {t.description} - ${t.amount}
                </p>
                <p className="text-sm text-gray-500">
                  {t.type} - {t.category}{" "}
                  {t.classification ? `(${t.classification})` : ""}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(t.id)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition flex items-center gap-1"
                >
                  <FiEdit size={16} /> Editar
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
                >
                  <FiTrash2 size={16} /> Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
