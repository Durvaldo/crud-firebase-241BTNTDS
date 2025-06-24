import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
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
    onSnapshot(collection(db, 'tarefas'), (snapshot) => {
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
    <>
      <h1>Lista de tarefas</h1>
      <div>
        <label htmlFor="addTarefa">Adicionar Tarefa</label>
        <br />
        <input
          type="text"
          id="addTarefa"
          value={tarefaInput}
          onChange={(e) => {
            setTarefaInput(e.target.value);
          }}
        />
        <button onClick={salvarTarefa}>Adicionar</button>
      </div>
      <ul>
        {listaTarefa.map((tarefa, index) => (
          <li key={index}>
            {editar == tarefa.id ? (
              <input
                type="text"
                value={editarValue}
                onChange={(e) => {
                  setEditarValue(e.target.value);
                }}
              />
            ) : (
              <span>{tarefa.nome} </span>
            )}
            <button
              onClick={() => {
                abrirEditar(tarefa);
              }}
            >
              Editar
            </button>
            <button
              onClick={() => {
                apagarTarefa(tarefa.id);
              }}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
