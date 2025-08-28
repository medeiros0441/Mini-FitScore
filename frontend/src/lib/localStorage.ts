// src/lib/localStorage.ts
import { Usuario } from "./interface";

const STORAGE_KEY = "usuario";

/**
 * Salva o usuário no localStorage
 */
export function setUsuario(usuario: Usuario) {
  if (!usuario) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

/**
 * Recupera o usuário do localStorage
 */
export function getUsuario(): Usuario | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as Usuario;
  } catch {
    return null;
  }
}

/**
 * Remove o usuário do localStorage
 */
export function removeUsuario() {
  localStorage.removeItem(STORAGE_KEY);
}
