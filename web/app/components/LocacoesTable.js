'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import date from 'date-and-time';
import { RiCouponFill } from "react-icons/ri";
import { FaFileAlt } from "react-icons/fa";

function LocacoesTable({ departmentId, user }) {
  const [locacoes, setLocacoes] = useState([]);

  useEffect(() => {
    if (departmentId) {
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/locacoes/lista`, {
        department_id: departmentId
      }).then(result => {
        setLocacoes(result.data);
      });
    }
  }, [departmentId]);

  async function handleStatusChange(id, newStatus, horas) {
    try {
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/locacoes/${id}/status`, {
        status: newStatus,
        horas: horas,
      });
  
      setLocacoes((prev) =>
        prev.map((locacao) => {
          if (locacao.id_locacao === id) {
            return {
              ...locacao,
              ...response.data // Atualiza com os dados retornados da API
            };
          }
          return locacao;
        })
      );
    } catch (error) {
      console.error('Erro ao atualizar o status da locação:', error);
    }
  }

  function imprimirCupom(locacao) {
    const cupomContent = `
    
    --Cupom de Finalização da Locação--

    ID: ${locacao.id_locacao}
    Bicicleta: ${locacao.id_bicicleta}
    Cliente: ${locacao.nome}
    Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(locacao.valor_total)}
    Data Gerado: ${date.format(new Date(), 'DD/MM/YYYY [ás] HH:mm:ss')}

    Muito Obrigado pela Sua Doação!
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<pre>${cupomContent}</pre>`);
    printWindow.document.close();
    printWindow.print();
  }

  function imprimirTermoAceite(locacao) {
    const termoContent = `
      Termo de Aceite
      Nome: ${locacao.nome}
      CPF: ${locacao.cpf}
      Telefone: ${locacao.telefone}
      Endereço: ${locacao.endereco}
      Data Atual: ${date.format(new Date(), 'DD/MM/YYYY')}


      Assinatura_________________________________     Data Início: ______________


      Assinatura_________________________________     Data Fim: ______________
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<pre>${termoContent}</pre>`);
    printWindow.document.close();
    printWindow.print();
  }

  return (
    <main>
      <table className='table'>
        <thead>
          <tr>
            <th>ID - Locação</th>
            <th>Bicicleta</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Data Início</th>
            <th>Data Chegada</th>
            <th>Data Fim</th>
            <th>Data Cadastro</th>
            <th>Valor Bicicleta</th>
            <th>Valor Hora</th>
            <th>Valor Total</th>
            <th>Termo</th>
            <th>Cupom</th>
          </tr>
        </thead>
        <tbody>
          {locacoes.map((locacao) => (
            <tr key={locacao.id_locacao} className='hover text-[15px]'>
              <td>#{locacao.id_locacao}</td>
              <td>{locacao.id_bicicleta}</td>
              <td>{locacao.nome.split(' ')[0]}</td>
              <td>
                {locacao.status === "Finalizado" ? (
                  <div className={`select select-success outline-none cursor-default flex items-center w-[133px]`}>
                    {locacao.status}
                  </div>
                ) : (
                  <select
                    value={locacao.status}
                    onChange={(e) => handleStatusChange(locacao.id_locacao, e.target.value, locacao.horas)}
                    className={`select ${locacao.status === "Pendente" ? "select-info" : locacao.status === "Em Trânsito" ? "select-warning" : "select-success"} outline-none`}
                  >
                    <option value="Pendente" disabled={locacao.status === 'Em Trânsito'}>Pendente</option>
                    <option value="Em Trânsito">Em Trânsito</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                )}
              </td>
              <td className='text-[12px]'>{locacao.data_inicio ? date.format(new Date(locacao.data_inicio), 'DD/MM/YYYY [ás] HH:mm:ss') : 'DD/MM/YYYY [ás] HH:mm:ss'}</td>
              <td className='text-[12px]'>{locacao.data_entrega ? date.format(new Date(locacao.data_entrega), 'DD/MM/YYYY [ás] HH:mm:ss') : 'DD/MM/YYYY [ás] HH:mm:ss'}</td>
              <td className='text-[12px]'>{locacao.data_fim ? date.format(new Date(locacao.data_fim), 'DD/MM/YYYY [ás] HH:mm:ss') : 'DD/MM/YYYY [ás] HH:mm:ss'}</td>
              <td className='text-[12px]'>{date.format(new Date(locacao.data_cad), 'DD/MM/YYYY [ás] HH:mm:ss')}</td>
              <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(locacao.preco)}</td>
              <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(locacao.preco_hr)}</td>
              <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(locacao.valor_total)}</td>
              <td>
                <FaFileAlt onClick={() => imprimirTermoAceite(locacao)} className="ml-2 hover:scale-125 transition-transform duration-300 ease-in-out" size={25} />
              </td>
              <td>
                {locacao.status === "Finalizado" ?
                  <RiCouponFill onClick={() => imprimirCupom(locacao)} className="ml-2 hover:scale-125 transition-transform duration-300 ease-in-out" size={25} />
                  :
                  ''
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default LocacoesTable;
