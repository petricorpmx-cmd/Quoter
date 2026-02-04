import { useState, useEffect } from 'react';
import { subscribeToAppState, saveAppState } from '../services/firebase/firestoreService';

const DEFAULT_ITEMS = [{
  id: '1',
  nombre: 'Producto de Ejemplo',
  cantidad: 1,
  proveedores: [{ id: 'p1', nombre: 'Proveedor Base', costo: 100, aplicaIva: true, margen: 20, link: '' }]
}];

export const useFirestore = (user) => {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [ivaRate, setIvaRate] = useState(16);
  const [isSaving, setIsSaving] = useState(false);

  // Sincronización con Firestore
  useEffect(() => {
    if (!user) {
      // Si no hay usuario, usar datos por defecto
      setItems(DEFAULT_ITEMS);
      return;
    }

    let unsubscribe;
    try {
      unsubscribe = subscribeToAppState(
        (data) => {
          if (data) {
            if (data.items) setItems(data.items);
            if (data.ivaRate !== undefined) setIvaRate(data.ivaRate);
          } else {
            setItems(DEFAULT_ITEMS);
          }
        },
        (error) => {
          console.error("Error de Firestore:", error);
          // Si hay error, usar datos por defecto
          setItems(DEFAULT_ITEMS);
        }
      );
    } catch (error) {
      console.error("Error al suscribirse a Firestore:", error);
      setItems(DEFAULT_ITEMS);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Guardado automático
  useEffect(() => {
    if (!user || items.length === 0) return;

    const timeoutId = setTimeout(async () => {
      setIsSaving(true);
      try {
        await saveAppState({ items, ivaRate });
      } catch (err) {
        console.error("Error al guardar", err);
      } finally {
        setTimeout(() => setIsSaving(false), 800);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [items, ivaRate, user]);

  return { items, setItems, ivaRate, setIvaRate, isSaving };
};
