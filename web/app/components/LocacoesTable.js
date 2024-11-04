'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import date from 'date-and-time';
import { RiCouponFill } from "react-icons/ri";
import { FaFileAlt } from "react-icons/fa";

function LocacoesTable({ departmentId, user }) {
  const [locacoes, setLocacoes] = useState([]);
  const [filteredLocacoes, setFilteredLocacoes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchLocacoes();
  }, [departmentId]);

  useEffect(() => {
    applyFilters();
  }, [startDate, endDate, statusFilter, locacoes]);

  async function fetchLocacoes() {
    if (departmentId) {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/locacoes/lista`, {
          department_id: departmentId,
        });
        setLocacoes(response.data);
        setFilteredLocacoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar locações:", error);
      }
    }
  }

  function applyFilters() {
    let filtered = locacoes;

    if (startDate) {
      filtered = filtered.filter((locacao) => {
        const locacaoDate = new Date(locacao.data_cad);
        return locacaoDate.setHours(0, 0, 0, 0) >= date.addHours(new Date(startDate), 3);
      });
    }

    if (endDate) {
      console.log(date.addHours(new Date(endDate), 3))
      filtered = filtered.filter((locacao) => {
        const locacaoDate = new Date(locacao.data_cad);
        return locacaoDate.setHours(0, 0, 0, 0) <= date.addHours(new Date(endDate), 3);
      });
    }

    if (statusFilter) {
      filtered = filtered.filter((locacao) => locacao.status === statusFilter);
    }

    setFilteredLocacoes(filtered);
    setCurrentPage(1);
  }

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
              ...response.data
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

  // Funções de Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLocacoes.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredLocacoes.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  return (
    <main>
      <div className="filter-section mb-4 flex">
        <label className="form-control">
          <div className="label">
            <span className="label-text">Data Cadastro Inicio</span>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Data Início"
            className="input input-bordered mr-2"
          />
        </label>
        <label className="form-control">
          <div className="label">
            <span className="label-text">Data Cadastro Fim</span>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Data Fim"
            className="input input-bordered mr-2"
          />
        </label>
        <label className="form-control">
          <div className="label">
            <span className="label-text">Status</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered"
          >
            <option value="">Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Trânsito">Em Trânsito</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </label>
      </div>

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
          {currentItems.map((locacao) => (
            <tr key={locacao.id_locacao} className='hover text-[15px]'>
              <td>#{locacao.id_locacao}</td>
              <td>{locacao.id_bicicleta}</td>
              <td>{locacao.nome.split(' ')[0]}</td>
              <td>
                {locacao.status === "Finalizado" ? (
                  <div className="select select-success outline-none cursor-default flex items-center w-[133px]">
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
                <button onClick={() => imprimirTermoAceite(locacao)} className='btn btn-sm btn-outline'><FaFileAlt className='mr-1' size={15} color='orange' />Imprimir</button>
              </td>
              <td>
                <button onClick={() => imprimirCupom(locacao)} className='btn btn-sm btn-outline'><RiCouponFill className='mr-1' size={15} color='orange' />Imprimir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination mt-4">
        <button onClick={goToFirstPage} disabled={currentPage === 1} className="btn btn-outline btn-sm mx-2">Primeira</button>
        <button onClick={goToPreviousPage} disabled={currentPage === 1} className="btn btn-outline btn-sm mx-2">Anterior</button>
        <span className="mx-2">{`Página ${currentPage} de ${totalPages}`}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages} className="btn btn-outline btn-sm mx-2">Próxima</button>
      </div>
    </main>
  );
}

export default LocacoesTable;
