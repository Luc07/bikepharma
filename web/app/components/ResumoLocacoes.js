'use client'
import { useEffect, useState } from 'react';

function ResumoLocacoes() {
  const [resumo, setResumo] = useState({ valorTotalConcluidas: 0, totalEmAberto: 0 });

  useEffect(() => {
    async function fetchResumo() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locacoes/resumo`);
        const data = await response.json();
        setResumo(data);
      } catch (error) {
        console.error('Erro ao buscar o resumo das locações:', error);
      }
    }

    fetchResumo();
  }, []);

  return (
    <main>
      <div>
        <p>Valor Total Concluídas Hoje: R$ {resumo.valorTotalConcluidas}</p>
        <p>Total de Locações em Aberto: {resumo.totalEmAberto}</p>
      </div>
    </main>
  );
}

export default ResumoLocacoes;
