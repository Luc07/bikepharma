'use client'
import { useState, useEffect } from 'react';

function NovaLocacaoModal({ isOpen, onClose, departmentId }) {
  const [cpfNome, setCpfNome] = useState('');
  const [cliente, setCliente] = useState(null);
  const [bicicletas, setBicicletas] = useState([]);
  const [bicicletaId, setBicicletaId] = useState(null);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [novoCliente, setNovoCliente] = useState(false);
  const [horas, setHoras] = useState(null);

  useEffect(() => {
    if (isOpen) {
      buscarBicicletas();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function buscarCliente() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes?search=${cpfNome}`);
      const data = await response.json();
      if (response.status !== 200 || !data[0]) {
        setCliente(null);
        setNome('');
        setCpf('');
        setTelefone('');
        setEndereco('');
        setNovoCliente(true);
      } else {
        setCliente(data[0]);
        setNome(data[0].nome);
        setCpf(data[0].cpf);
        setTelefone(data[0].telefone || '');
        setEndereco(data[0].endereco || '');
        setNovoCliente(false);
      }
    } catch (error) {
      console.error('Erro ao buscar cliente:');
    }
  }

  async function buscarBicicletas() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bicicletas/lista`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department_id: departmentId,
        }),
      });
      
      const data = await response.json();
      console.log(data)
      setBicicletas(data);
    } catch (error) {
      console.error('Erro ao buscar bicicletas:');
    }
  }

  async function criarLocacao() {
    try {
        const clienteData = novoCliente ? { nome, cpf, telefone, endereco } : { id: cliente.id_cliente };


        if (novoCliente) {
            const clienteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteData),
            });

            if (!clienteResponse.ok) {
                throw new Error('Erro ao registrar cliente');
            }

            
            const clienteRegistrado = await clienteResponse.json();
            clienteData.id = clienteRegistrado.id;
        }

        const locacaoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locacoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cliente: clienteData,
                bicicleta_id: bicicletaId,
                status: 'Pendente',
                department_id: departmentId,
                horas: horas
            }),
        });

        if (!locacaoResponse.ok) {
            throw new Error('Erro ao criar a locação');
        }

        alert('Locação registrada com sucesso!');
        onClose();
        setBicicletaId(null);
        setCpfNome('');
        setCliente(null);
        setEndereco('');
        setNome('');
        setCpf('');
        setTelefone('');
        setHoras(null);
    } catch (error) {
        console.error('Erro ao criar a locação:');
    }
}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#15191E] rounded-lg p-8 w-full max-w-lg relative shadow-lg">
        <div onClick={onClose} className="absolute top-4 right-4 text-white cursor-pointer border-2 rounded-full w-[30px] h-[30px] flex items-center justify-center">X</div>
        <h2 className="text-2xl font-bold mb-6 text-center">Registrar Nova Locação</h2>
        
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Pesquisar CPF ou Nome"
            value={cpfNome}
            onChange={(e) => setCpfNome(e.target.value)}
            className="input w-full"
          />
          <button type="button" onClick={buscarCliente} className="w-full btn btn-primary mt-2 hover:scale-105 transition-transform duration-300 ease-in-out">
            Buscar Cliente
          </button>

          <div className="space-y-4 mt-6">
            <input
              type="text"
              placeholder="Nome do Cliente"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input w-full"
              required
              disabled={!novoCliente}
            />
            <input
              type="text"
              placeholder="CPF do Cliente"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="input w-full"
              required
              disabled={!novoCliente}
            />
            <input
              type="text"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="input w-full"
              required
              disabled={!novoCliente}
            />
            <input
              type="text"
              placeholder="Endereço"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="input w-full"
              required
              disabled={!novoCliente}
            />
          </div>

          <select
            onChange={(e) => setBicicletaId(e.target.value)}
            className="select select-input w-full"
            required
          >
            <option value="">Selecione a bicicleta</option>
            {bicicletas.map((bicicleta) => (
              <option key={bicicleta.id_bicicleta} value={bicicleta.id_bicicleta}>
                {bicicleta.id_bicicleta} - {bicicleta.modelo}
              </option>
            ))}
          </select>

          <div className="space-y-4 mt-6">
          <input
              type="number"
              placeholder="Horas do Aluguel"
              onChange={(e) => setHoras(e.target.value)}
              className="input w-full"
              required
            />
          </div>

          <button
            type="submit"
            onClick={criarLocacao}
            className="w-full btn btn-success mt-6 hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            Finalizar Locação
          </button>
        </form>
      </div>
    </div>
  );
}

export default NovaLocacaoModal;
