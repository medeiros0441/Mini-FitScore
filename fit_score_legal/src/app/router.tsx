"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, ReactElement } from "react";

import Default from "@/app/default/default";
import Candidato from "@/app/default/candidato";
import SobrePage from "@/app/default/Sobre";
import QuizPage from "@/app/default/quiz";
import ConclusaoPage from "@/app/default/conclusao";
import AvaliadorPage from "@/app/default/dashbord";
import CadastrarAvaliadorPage from "@/app/default/avaliador";
import ErroPage from "@/app/default/ErroPage";
import { useAuth } from "@/context/AuthProvider";
import LoadingScreen from "@/components/LoadingScreen";

// Mapa de rotas
const routeMap: Record<string, ReactElement> = {
  "/": <Default />,
  "/candidato": <Candidato />,
  "/sobre": <SobrePage />,
  "/quiz": <QuizPage />,
  "/conclusao": <ConclusaoPage />,
  "/dashboard": <AvaliadorPage />,
  "/avaliador": <CadastrarAvaliadorPage />,
};

export default function Router() {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario, loading } = useAuth();

  useEffect(() => {
    if (!usuario) return;

    // Redirecionamento apenas para candidatos
    if (usuario.tipo === "candidato") {
      if (!usuario.conclusao && pathname !== "/quiz") {
        router.push("/quiz");
      } else if (usuario.conclusao && pathname !== "/conclusao") {
        router.push("/conclusao");
      }
    }
  }, [usuario, pathname, router]);

  // Loader enquanto carrega usuário
  if (loading) return <LoadingScreen />;

  // Retorna página correspondente ou fallback
  return routeMap[pathname] ?? <ErroPage />;
}
