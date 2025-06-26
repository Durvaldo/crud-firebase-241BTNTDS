import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase/configs.js';
import { useEffect, useState } from 'react';

export default function App() {
  const [listaTarefa, setListaTarefa] = useState([]);
  const [tarefaInput, setTarefaInput] = useState('');
  const [editarValue, setEditarValue] = useState('');
  const [editar, setEditar] = useState(null);

  async function salvarTarefa() {
    if (!tarefaInput.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'tarefas'), {
        nome: tarefaInput,
      });
      setTarefaInput('');
      console.log('Id da tarefa', docRef.id);
    } catch (e) {
      console.error('Erro ao adicionar tarefa: ', e);
    }
  }

  function buscarTarefas() {
    const pesquisa = query(collection(db, 'tarefas'), orderBy('nome'))
    onSnapshot(pesquisa, (snapshot) => {
      let lista = [];
      snapshot.forEach((doc) => {
        const item = {
          id: doc.id,
          ...doc.data(),
        };
        lista.push(item);
      });
      setListaTarefa(lista);
    });
  }

  async function apagarTarefa(tarefaID) {
    const documento = doc(db, 'tarefas', tarefaID);
    await deleteDoc(documento);
  }

  function abrirEditar(tarefa) {
    if (tarefa.id != editar) {
      setEditar(tarefa.id);
    } else {
      const documento = doc(db, 'tarefas', editar);
      console.log(tarefaInput);
      updateDoc(documento, { nome: editarValue });
      setEditar(null);
    }
    setEditarValue(tarefa.nome);
  }

  useEffect(() => {
    buscarTarefas();
  }, []);

  return (
    <div className='bg-sky-600 my-5 p-3 rounded-lg w-100 shadow-md shadow-cyan-50'>
      <h1 className='text-xl text-center font-bold'>Lista de Tarefas</h1>
      <hr />
      <div className='mt-2 flex justify-between'>
        <input
          className='input-padrao'
          type="text"
          id="addTarefa"
          value={tarefaInput}
          onChange={(e) => {
            setTarefaInput(e.target.value);
          }}
        />
        <button
          className='ml-2 btn-success btn w-25'
          onClick={salvarTarefa}
        >
          Adicionar
        </button>
      </div>
      <ul className='border rounded-lg mt-2'>
        {listaTarefa.map((tarefa, index) => (
          <li className='' key={index}>
            <div className="flex justify-between gap-2 m-1">
              <div className="">
                <span>#{index} | </span>
                {editar == tarefa.id ? (
                  <input
                    className='input-padrao'
                    type="text"
                    value={editarValue}
                    onChange={(e) => {
                      setEditarValue(e.target.value);
                    }}
                  />
                ) : (
                  <span>{tarefa.nome} </span>
                )}
              </div>
              <div className="flex justify-between w-25">
                <button
                  className='btn btn-warning'
                  onClick={() => {
                    abrirEditar(tarefa);
                  }}
                >
                  Editar
                </button>
                <button
                  className='btn btn-danger'
                  onClick={() => {
                    apagarTarefa(tarefa.id);
                  }}
                >
                  x
                </button>
              </div>
            </div>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
