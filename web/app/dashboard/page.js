'use client'
import ResumoLocacoes from '../components/ResumoLocacoes';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <main>
      {user ? (
      <div>
        <h1>Resumo das Locações</h1>
        <ResumoLocacoes />
      </div>
      ) : (
        <p>Você não está autenticado.</p>
      )}
    </main>
  );
}
