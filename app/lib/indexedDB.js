// app/lib/indexedDB.js
export async function openDB() {
  return new Promise((resolve, reject) => {
    console.log("🔹 Abriendo IndexedDB...");
    const request = indexedDB.open("FinanzasDB", 1);
    request.onupgradeneeded = (event) => {
      console.log("🛠️ Creando almacén de transacciones...");
      const db = event.target.result;
      if (!db.objectStoreNames.contains("transacciones")) {
        db.createObjectStore("transacciones", { keyPath: "id" });
      }
    };
    request.onsuccess = () => {
      console.log("✅ IndexedDB abierta con éxito");
      resolve(request.result);
    };
    request.onerror = () => {
      console.error("❌ Error al abrir IndexedDB:", request.error);
      reject(request.error);
    };
  });
}

export async function obtenerTransacciones() {
  const db = await openDB();
  const tx = db.transaction("transacciones", "readonly");
  const store = tx.objectStore("transacciones");
  return new Promise((resolve, reject) => {
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

export async function agregarTransaccion(transaccion) {
  const db = await openDB();
  const tx = db.transaction("transacciones", "readwrite");
  const store = tx.objectStore("transacciones");
  return new Promise((resolve, reject) => {
    const request = store.add(transaccion);
    request.onsuccess = () => {
      console.log("✅ Transacción agregada:", transaccion);
      resolve(true);
    };
    request.onerror = () => {
      console.error("❌ Error al agregar transacción:", request.error);
      reject(request.error);
    };
  });
}

export async function actualizarTransaccion(transaccion) {
  const db = await openDB();
  const tx = db.transaction("transacciones", "readwrite");
  const store = tx.objectStore("transacciones");
  return new Promise((resolve, reject) => {
    const request = store.put(transaccion);
    request.onsuccess = () => {
      console.log("🔄 Transacción actualizada:", transaccion);
      resolve(true);
    };
    request.onerror = () => {
      console.error("❌ Error al actualizar transacción:", request.error);
      reject(request.error);
    };
  });
}

export async function eliminarTransaccion(id) {
  const db = await openDB();
  const tx = db.transaction("transacciones", "readwrite");
  const store = tx.objectStore("transacciones");
  return new Promise((resolve, reject) => {
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
