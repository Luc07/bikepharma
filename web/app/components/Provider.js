'use client'
import { AuthProvider } from "../context/AuthContext";

export default function Provider({ children }){
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}