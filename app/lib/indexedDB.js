export async function openDB() {
  return new Promise((resolve, reject) => {
    console.log("🔹 Abriendo IndexedDB...");
    const request = indexedDB.open("FinanzasDB", 1);

    request.onupgradeneeded = (event) => {
      console.log("🛠️ Verificando y creando almacén de transacciones...");
      const db = event.target.result;

      if (!db.objectStoreNames.contains("transactions")) {
        db.createObjectStore("transactions", { keyPath: "id" });
        console.log("✅ Almacén de transacciones creado con éxito.");
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("transactions")) {
        console.error("❌ El almacén 'transactions' no existe.");
        reject(new Error("El almacén 'transactions' no fue encontrado."));
        return;
      }

      console.log("✅ IndexedDB abierta con éxito.");
      resolve(db);
    };

    request.onerror = () => {
      console.error("❌ Error al abrir IndexedDB:", request.error);
      reject(request.error);
    };
  });
}

export async function getTransactions() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("transactions", "readonly");
    const store = tx.objectStore("transactions");
    const request = store.getAll();

    request.onsuccess = () => {
      console.log("📂 Transacciones obtenidas:", request.result);
      resolve(request.result);
    };

    request.onerror = () => {
      console.error("❌ Error al obtener transacciones:", request.error);
      reject(request.error);
    };
  });
}

export async function addTransaction(transaction) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("transactions", "readwrite");
    const store = tx.objectStore("transactions");
    const request = store.add(transaction);

    request.onsuccess = () => {
      console.log("✅ Transacción agregada:", transaction);
      resolve(true);
    };

    request.onerror = () => {
      console.error("❌ Error al agregar transacción:", request.error);
      reject(request.error);
    };
  });
}

export async function updateTransaction(transaction) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("transactions", "readwrite");
    const store = tx.objectStore("transactions");
    const request = store.put(transaction);

    request.onsuccess = () => {
      console.log("🔄 Transacción actualizada:", transaction);
      resolve(true);
    };

    request.onerror = () => {
      console.error("❌ Error al actualizar transacción:", request.error);
      reject(request.error);
    };
  });
}

export async function deleteTransaction(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("transactions", "readwrite");
    const store = tx.objectStore("transactions");
    const request = store.delete(id);

    request.onsuccess = () => {
      console.log(`🗑️ Transacción eliminada con ID: ${id}`);
      resolve(true);
    };

    request.onerror = () => {
      console.error(
        `❌ Error al eliminar transacción con ID: ${id}`,
        request.error
      );
      reject(request.error);
    };
  });
}
