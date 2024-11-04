'use client'
import { useEffect, useState } from 'react';
import { FaMoneyBillWave, FaBicycle } from "react-icons/fa";
import axios from 'axios';

function ResumoLocacoes({ departmentId }) {
  const [resumo, setResumo] = useState();

  useEffect(() => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/locacoes/resumo`, { department_id: departmentId }).then(result => {
      setResumo(result.data)
      console.log(result.data)
    })
  }, [departmentId]);

  return (
    <main className='flex flex-col'>
      {departmentId == 1 ? (
        resumo?.map((res, index) => (
          <div key={index} className="stats shadow mb-4">
            <div className="stat">
              <div className="stat-figure text-success">
                <FaMoneyBillWave size={40} />
              </div>
              <div className="stat-title">Total Faturado - R{res.id_filial !== 1 ? res.id_filial % 100 : res.id_filial}</div>
              <div className="stat-value text-success">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(res.valorTotalConcluidas)}
              </div>
            </div>

            <div className="stat text-primary">
              <div className="stat-figure">
                <FaBicycle size={40} />
              </div>
              <div className="stat-title">Locações Concluídas</div>
              <div className="stat-value">{res.totalFinalizado}</div>
            </div>

            <div className="stat text-warning">
              <div className="stat-figure">
                <FaBicycle size={40} />
              </div>
              <div className="stat-title">Locações Em Trânsito</div>
              <div className="stat-value">{res.totalEmAberto}</div>
            </div>
          </div>
        ))
      ) : (
        resumo?.length > 0 ?
        resumo?.map((res, index) => (
          <div key={index} className="stats shadow mb-4">
            <div className="stat">
              <div className="stat-figure text-success">
                <FaMoneyBillWave size={40} />
              </div>
              <div className="stat-title">Total Faturado</div>
              <div className="stat-value text-success">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(res.valorTotalConcluidas)}
              </div>
            </div>

            <div className="stat text-primary">
              <div className="stat-figure">
                <FaBicycle size={40} />
              </div>
              <div className="stat-title">Locações Concluídas</div>
              <div className="stat-value">{res.totalFinalizado}</div>
            </div>

            <div className="stat text-warning">
              <div className="stat-figure">
                <FaBicycle size={40} />
              </div>
              <div className="stat-title">Locações Em Trânsito</div>
              <div className="stat-value">{res.totalEmAberto}</div>
            </div>
          </div>
        )) 
        : 
        <div className="stats shadow mb-4">
            <div className="stat">
              <div className="stat-figure text-success">
                <FaMoneyBillWave size={40} />
              </div>
              <div className="stat-title">Total Faturado</div>
              <div className="stat-value text-success">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(0)}
              </div>
            </div>

            <div className="stat text-primary">
              <div className="stat-figure">
                <FaBicycle size={40} />
              </div>
              <div className="stat-title">Locações Concluídas</div>
              <div className="stat-value">0</div>
            </div>

            <div className="stat text-warning">
              <div className="stat-figure">
                <FaBicycle size={40} />
              </div>
              <div className="stat-title">Locações Em Trânsito</div>
              <div className="stat-value">0</div>
            </div>
          </div>
      )}
    </main>
  );
}

export default ResumoLocacoes;
