'use client'
import Navbar from '../components/Navbar';
import ResumoLocacoes from '../components/ResumoLocacoes';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <main className='h-screen bg-base-200'>
      <Navbar/>
      {user ? (
        <div className='flex items-center justify-center p-5'>
          <ResumoLocacoes departmentId={user?.department_id}/>
        </div>
      ) : (
        <p>Você não está autenticado.</p>
      )}
    </main>
  );
}
