"use client";

import { motion } from "framer-motion";
import { CheckCircle, Mail, Home } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";

export default function Conclusao() {
    const { reset,usuario } = useAuth();
  

    
  return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md  p-8 flex flex-col items-center font-sans    "
      >
        {/* Ícone de sucesso */}
        <motion.div
          initial={{ rotate: -20, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-4"
        >
          <CheckCircle className="w-16 h-16 text-green-600" />
        </motion.div>

        {/* Título */}
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Quiz enviado com sucesso!
        </h1>
{/* Mensagem */}
<div className="mt-4 text-center">
  <p className="text-lg text-gray-600 flex justify-center items-center gap-2">
    <Mail className="w-5 h-5 text-blue-600" />
    Resultados enviados para:
  </p>
  <p className="text-lg font-semibold text-gray-800 mt-1">
    {usuario?.email}
  </p>
</div>


        {/* Botão voltar */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          <Home className="w-5 h-5" />
          Voltar para início
        </motion.a>
      </motion.div>
  );
}
