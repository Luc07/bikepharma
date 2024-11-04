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
    if (startDate || endDate || statusFilter) {
      setCurrentPage(1);
    }
  }

  async function handleStatusChange(id, newStatus, horas, page) {
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
      setCurrentPage(page)
    } catch (error) {
      console.error('Erro ao atualizar o status da locação:', error);
    }
  }

  function imprimirCupom(locacao) {
    const cupomContent = `
    <html>
      <head>
        <style>
          body {
            font-size: 18px; /* Define o tamanho da fonte */
            font-family: Arial, sans-serif; /* Define a fonte */
            line-height: 1.5; /* Define o espaçamento entre linhas */
            text-align: center;
          }
          h2 {
            font-size: 20px;
            font-weight: bold;
          }
          .cupom-info {
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <h2>--Cupom de Finalização da Locação--</h2>
        <p><strong>ID do Cupom:</strong> ${locacao.id_locacao}</p>
        <p><strong>Bicicleta:</strong> ${locacao.id_bicicleta}</p>
        <p><strong>Cliente:</strong> ${locacao.nome}</p>
        <p><strong>Valor:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(locacao.valor_total)}</p>
        <p><strong>Data:</strong> ${new Date(locacao.data_fim).toLocaleDateString('pt-BR')} às ${new Date(locacao.data_fim).toLocaleTimeString('pt-BR')}</p>
        
        <p class="cupom-info">Muito Obrigado pela Sua Doação!</p>
      </body>
    </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(cupomContent);
    printWindow.document.close();
    printWindow.print();
  }

  function imprimirTermoAceite(locacao) {
    const termoContent = `
  <html>
      <head>
        <style>
          body {
            font-size: 18px; /* Define o tamanho da fonte */
            font-family: Arial, sans-serif; /* Define a fonte */
            display: flex;
            line-height: normal;
            flex-direction: column;
            align-items: center;
          }
          .assinatura {
            margin-top: 20px;
          }
          .section {
            margin-bottom: 20px;
          }
          .page2 {
            page-break-before: always;
          }
        </style>
      </head>
      <body>
        <h4>TERMO DE USO E RESPONSABILIDADE DA BIKEPHARMA</h4>
        <div class="section">
          O presente termo rege a utilização pelos clientes da Bikepharma e seu aluguel. Inicialmente você já concorda e entendeu todos as diretrizes de uso e sua responsabilidade ao utilizar o serviço.
        </div>
        <div class="section">
          O objetivo de disponibilizar a bicicleta para utilização pelos usuários aos arredores da Redepharma é reafirmar nosso propósito enraizado na cultura da empresa, a promoção da saúde e bem-estar de todos nossos clientes.
        </div>
        <div class="section">
          Além disso, vale ressaltar que todo valor arrecadado pelo projeto Bikepharma será destinado ao Hospital da FAP, localizado na cidade de Campina Grande - Paraíba, como forma de doação e com o intuito de, solidariamente, ajudar esse hospital que presta um serviço necessário a toda população campinense e de regiões vizinhas.
        </div>
        <div class="section">
          O aluguel será no valor mínimo de R$ 10,00 (10 reais), porém caso você sinta o desejo e a motivação de doar mais algum valor, sinta-se à vontade para alugar a bicicleta pelo valor que você achar essencial que será para bem um maior.
        </div>
        <div class="section">
          O tempo máximo do aluguel será de 1 hora, com possibilidade de renovar a concessão por mais 30 minutos.
        </div>
        <div class="section">
          É necessário realizar um cadastro prévio, de forma verdadeira e completa, devendo estar em porte um documento com foto (ex.: RG, passaporte, carteira da OAB, CNH etc.) que comprovem a identidade da pessoa que estará utilizando, bem como assinar o presente termo e realizar o pagamento para o colaborador responsável da Redepharma.
        </div>
        <div class="section">
          A bicicleta tem uso individual e intransferível, apenas em casos do responsável legal alugar para o menor.
        </div>
        <div class="section">
          Ao assinar o termo de uso e responsabilidade, o locatário se compromete a utilizar a bicicleta de forma responsável e cumprir o prazo estabelecido de tempo, devolvendo sem nenhum vício ou defeito e não utilizando de forma inadequada, sob pena de arcar com os custos de consertos.
        </div>
        <div class="section">
          O uso inadequado da bicicleta é qualquer conduta que extrapole o uso comum de uma bicicleta urbana, como por exemplo: pedalar erguendo a roda dianteira da bicicleta; utilizar o freio dianteiro para erguer a parte traseira da bicicleta ou o freio traseiro para realizar derrapagens, pedalar em velocidade inadequada à via em que transita ou em desacordo com as normas de trânsito.
        </div>
        <div class="section">
          É proibido a utilização da bicicleta para fins de prestação de serviços (ex.: comerciais, entregador de delivery etc.) e que não seja para lazer, e deverá circular pelas redondezas da Redepharma, do Açude Velho e Parque da Criança.
        </div>
        <div class="section">
          Todas as bicicletas terão um chip de localização, para controle e segurança de possíveis usos inadequados, como sair da área permitida de circulação, e prevenção contra furtos ou roubos.
        </div>
        <div class="section">
          Os locatários deverão cumprir o horário estabelecido, devolvendo a bicicleta no mesmo local onde foi realizada a retirada, assinando o termo de entrega após a vistoria do funcionário responsável da Redepharma, com tolerância máxima de 15 minutos.
        </div>
        <div class="section">
          Caso a bicicleta não seja devolvida no prazo estabelecido, sem justificativa, você deverá arcar com o custo na totalidade, sob pena de ser acionada a Polícia Militar.
        </div>
        <div class="section">
          Se a sua bicicleta for furtada ou roubada por um terceiro, deverá comunicar imediatamente a Redepharma para que sejam tomadas as medidas cabíveis.
        </div>
        <div class="page2">
          <p><strong>Nome:</strong> ${locacao.nome}</p>
          <p><strong>CPF:</strong> ${locacao.cpf}</p>
          <p><strong>Telefone:</strong> ${locacao.telefone}</p>
          <p><strong>Endereço:</strong> ${locacao.endereco}</p>
          <p><strong>Data:</strong> ${new Date(locacao.data_inicio).toLocaleDateString('pt-BR')} às ${new Date(locacao.data_inicio).toLocaleTimeString('pt-BR')}</p>

          <div class="assinatura">
            <p>Assinatura do Usuario:</p>
            <p>_________________________________________</p>
            <p>Data Início: ___/____/_______</p>
          </div>
          <div class="assinatura">
            <p>Assinatura do Funcionário:</p>
            <p>_________________________________________</p>
            <p>Data Fim: ___/____/_______</p>
          </div>
        </div>
      </body>
    </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(termoContent);
    printWindow.document.close();
    printWindow.print();
  }

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
            className={`select select-bordered ${statusFilter === "Pendente" ? "select-info" : statusFilter === "Em Trânsito" ? "select-warning" : statusFilter === "Cancelado" ? "select-error" : statusFilter === "Finalizado" ? "select-success" : "select-accent"} outline-none`}
          >
            <option value="">Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Trânsito">Em Trânsito</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Cancelado">Cancelado</option>
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
              <td>{locacao.nome?.split(' ')[0]}</td>
              <td>
                {locacao.status === "Finalizado" ? (
                  <div className="select select-success outline-none cursor-default flex items-center w-[133px]">
                    {locacao.status}
                  </div>
                ) : (
                  <select
                    value={locacao.status}
                    onChange={(e) => handleStatusChange(locacao.id_locacao, e.target.value, locacao.horas, currentPage)}
                    className={`select ${locacao.status === "Pendente" ? "select-info" : locacao.status === "Em Trânsito" ? "select-warning" : locacao.status === "Cancelado" ? "select-error" : "select-success"} outline-none`}
                  >
                    <option value="Pendente" disabled={locacao.status === 'Em Trânsito' || locacao.status === 'Cancelado'}>Pendente</option>
                    <option value="Em Trânsito" disabled={locacao.status === "Cancelado"}>Em Trânsito</option>
                    <option value="Finalizado" disabled={locacao.status === "Cancelado"}>Finalizado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                )}
              </td>
              <td className='text-[12px]'>{locacao.data_inicio ? date.format(new Date(locacao.data_inicio), 'DD/MM/YYYY [ás] HH:mm:ss') : ''}</td>
              <td className='text-[12px]'>{locacao.data_entrega ? date.format(new Date(locacao.data_entrega), 'DD/MM/YYYY [ás] HH:mm:ss') : ''}</td>
              <td className='text-[12px]'>{locacao.data_fim ? date.format(new Date(locacao.data_fim), 'DD/MM/YYYY [ás] HH:mm:ss') : ''}</td>
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
