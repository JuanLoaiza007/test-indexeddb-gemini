"use client";
import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/app/lib/indexedDB";
import IASuggestion from "@/app/transacciones/_components/IASuggestion";
import TransactionHistory from "@/app/transacciones/_components/TransactionHistory";
import TransactionForm from "@/app/transacciones/_components/TransactionForm";
import CustomModal from "@/app/_components/CustomModal";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(getInitialFormState());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    const data = await getTransactions();
    console.log("📂 Transacciones obtenidas:", data);
    setTransactions(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.type === "Gasto" && !form.classification) {
      alert("Debes seleccionar una clasificación");
      return;
    }

    if (form.id) {
      console.log("🔄 Actualizando transacción:", form);
      await updateTransaction(form);
    } else {
      const newTransaction = { ...form, id: Date.now() };
      console.log("➕ Agregando transacción:", newTransaction);
      await addTransaction(newTransaction);
    }

    setForm(getInitialFormState());
    await loadTransactions();
    setIsModalOpen(false);
  }

  async function handleDelete(id) {
    console.log(`🗑️ Eliminando transacción con ID: ${id}`);
    await deleteTransaction(id);
    setTransactions(transactions.filter((t) => t.id !== id));
  }

  async function handleEdit(id) {
    const transaction = transactions.find((t) => t.id === id);
    console.log("✏️ Editando transacción:", transaction);
    setForm(transaction);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setForm(getInitialFormState()); // Restablece el formulario al cerrar el modal
    setIsModalOpen(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="p-6 relative h-full">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Gestión de Transacciones
      </h1>

      <div className="">
        <TransactionHistory
          transactions={transactions}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>

      {/* Posiciona la burbuja de IA en la esquina inferior izquierda */}
      <div className="absolute bottom-6 left-6">
        <IASuggestion transactions={transactions} />
      </div>

      {/* Botón flotante para agregar transacciones */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-green-700 text-white p-4 rounded-full shadow-lg hover:bg-green-800 transition"
      >
        <FiPlus size={24} />
      </button>

      <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TransactionForm
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </CustomModal>
    </div>
  );
}

function getInitialFormState() {
  return {
    id: "",
    type: "Ingreso",
    classification: "",
    description: "",
    category: "",
    amount: "",
    date: "",
  };
}
