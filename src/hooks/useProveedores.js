import { useState, useEffect } from 'react';
import { 
  subscribeToProveedores, 
  saveProveedor, 
  updateProveedor, 
  deleteProveedor 
} from '../services/firebase/proveedoresService';

export const useProveedores = (user) => {
  const [proveedores, setProveedores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setProveedores([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToProveedores(
      (proveedores) => {
        setProveedores(proveedores);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error al obtener proveedores:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const guardarProveedor = async (proveedorData) => {
    if (!user) return null;
    setIsSaving(true);
    try {
      return await saveProveedor(proveedorData);
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const actualizarProveedor = async (proveedorId, data) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProveedor(proveedorId, data);
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const eliminarProveedor = async (proveedorId) => {
    if (!user) return;
    try {
      await deleteProveedor(proveedorId);
    } catch (error) {
      throw error;
    }
  };

  return {
    proveedores,
    isLoading,
    isSaving,
    guardarProveedor,
    actualizarProveedor,
    eliminarProveedor
  };
};
