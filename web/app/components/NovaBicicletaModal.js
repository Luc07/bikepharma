import axios from 'axios';
import { useState } from 'react';

export default function CadastrarBicicletaModal({ isOpen, onClose, departmentId }) {
  const [numero, setNumero] = useState('');
  const [modelo, setModelo] = useState('');
  const [preco, setPreco] = useState('');
  const [precoHr, setPrecoHr] = useState('');
  const [filial, setFilial] = useState('1055');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novaBicicleta = {
      numero,
      modelo,
      preco,
      preco_hr: precoHr,
      filial,
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bicicletas`, {
        novaBicicleta
      })
      onClose();
    } catch (error) {
      console.error('Erro ao cadastrar bicicleta:');
    }
  };

  if (!isOpen || departmentId != 1) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#15191E] p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Cadastrar Bicicleta</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Número da Bicicleta:
            <input
              type="text"
              className="input input-bordered w-full"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
          </label>
          <label className="block mb-2">
            Modelo:
            <input
              type="text"
              className="input input-bordered w-full"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              required
            />
          </label>
          <label className="block mb-2">
            Preço:
            <input
              type="number"
              className="input input-bordered w-full"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </label>
          <label className="block mb-2">
            Preço por Hora:
            <input
              type="number"
              className="input input-bordered w-full"
              value={precoHr}
              onChange={(e) => setPrecoHr(e.target.value)}
              required
            />
          </label>
          <label className="block mb-4">
            Filial:
            <select
              className="select select-bordered w-full"
              value={filial}
              onChange={(e) => setFilial(e.target.value)}
              required
            >
              <option value="1055">Filial R-55</option>
              <option value="1098">Filial R-98</option>
            </select>
          </label>
          <div className="flex justify-end">
            <button type="button" className="btn btn-outline mr-2 hover:scale-105 transition-transform duration-300 ease-in-out" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-success hover:scale-105 transition-transform duration-300 ease-in-out">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
