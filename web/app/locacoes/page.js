'use client'
import { useState } from 'react';
import LocacoesTable from '../components/LocacoesTable';
import NovaLocacaoModal from '../components/NovaLocacaoModal';
import { useAuth } from '../context/AuthContext';
import CadastrarBicicletaModal from '../components/NovaBicicletaModal';

export default function LocacoesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCadastrarBicicletaModalOpen, setIsCadastrarBicicletaModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <main className='bg-[#1D232A]'>
      <div className='flex flex-col h-screen'>
        {/* <div className='text-[32px] flex items-center justify-start p-[3rem] bg-[#1F2020]'>
          <h1>Locações BikePharma</h1>
        </div> */}
        <div className="navbar bg-base-300">
          <button className="btn btn-ghost text-xl">Locações BikePharma {user?.name}</button>
        </div>
       
       <div className='flex items-center justify-center'>
          <div className='flex flex-col w-screen p-[38px] gap-6'>
            <div className='flex justify-between'>
              <button className="btn btn-outline btn-success" onClick={() => setIsModalOpen(true)}>+ Nova Locação</button>
              <button className="btn btn-outline btn-success" onClick={() => setIsCadastrarBicicletaModalOpen(true)}>+ Cadastrar Bicicleta</button>
            </div>
            <LocacoesTable departmentId={user?.department_id}/>
          </div>
       </div>
        <NovaLocacaoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} departmentId={user?.department_id}/>
        <CadastrarBicicletaModal isOpen={isCadastrarBicicletaModalOpen} onClose={() => setIsCadastrarBicicletaModalOpen(false)} departmentId={user?.department_id}/>
      </div>
    </main>
  );
}
