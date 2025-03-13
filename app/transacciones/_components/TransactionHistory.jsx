import { useState, useMemo } from "react";
import {
  FiEdit,
  FiTrash2,
  FiFilter,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
} from "react-icons/fi";

export default function TransactionHistory({
  transactions,
  handleEdit,
  handleDelete,
}) {
  const [dateFilter, setDateFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const getBorderColor = (transaction) => {
    if (transaction.type === "Ingreso") return "border-green-500";
    if (transaction.classification === "esencial") return "border-yellow-500";
    if (transaction.classification === "opcional") return "border-red-500";
    return "border-gray-300";
  };

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      switch (dateFilter) {
        case "day":
          return transactionDate.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return transactionDate >= weekAgo;
        case "month":
          return (
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        default:
          return true;
      }
    });
  }, [transactions, dateFilter]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortField === "name") {
        return sortOrder === "asc"
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      }
      if (sortField === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortField === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      return 0;
    });
  }, [filteredTransactions, sortField, sortOrder]);

  return (
    <div className="p-4 rounded-lg bg-gray-100 shadow-lg">
      {/* Controles de Filtros y Ordenación */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <FiFilter size={18} className="text-gray-600" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">Todas</option>
            <option value="day">Hoy</option>
            <option value="week">Última semana</option>
            <option value="month">Este mes</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Ordenar por:</span>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="date">Fecha</option>
            <option value="name">Nombre</option>
            <option value="amount">Cantidad</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="bg-gray-300 p-2 rounded-full hover:bg-gray-400 transition"
          >
            {sortOrder === "asc" ? (
              <FiArrowUp size={16} />
            ) : (
              <FiArrowDown size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Lista de Transacciones */}
      {sortedTransactions.length === 0 ? (
        <p className="text-gray-500 text-center">
          No hay transacciones registradas.
        </p>
      ) : (
        <ul className="space-y-2">
          {sortedTransactions.map((t) => (
            <li
              key={t.id}
              className={`flex justify-between items-center p-4 bg-white rounded-lg shadow border-l-4 ${getBorderColor(
                t
              )}`}
            >
              <div className="flex flex-col">
                <p className="font-semibold text-lg">
                  {t.description} -{" "}
                  <span className="font-bold">${t.amount}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {t.type} - {t.category}{" "}
                  {t.classification ? `(${t.classification})` : ""}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <FiCalendar size={14} />
                  <span>{t.date}</span>
                </div>
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
