import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./ListEquipamentos.css";

type Equip = {
  id: number;
  nome: string;
  serial?: string | null;
  mac?: string | null;
  destino?: string | null;
  status: string;
  dataEntrada: string;
};
type Props = {
  searchQuery?: string;
  searchField?: string;
};

export default function ListEquipamentos({ searchQuery = "", searchField = "all" }: Props) {
  const [items, setItems] = useState<Equip[]>([]);
  const [loading, setLoading] = useState(true);
  const [exitForm, setExitForm] = useState<{ id?: number; destino: string }>({ destino: "" });

  async function load() {
    try {
      const { data } = await api.get("/equipamentos");
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("equipamento:changed", handler);
    return () => window.removeEventListener("equipamento:changed", handler);
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Confirmar exclusão?")) return;
    try {
      await api.delete(`/equipamentos/${id}`);
      load();
    } catch (error) {
      alert("Erro ao excluir equipamento");
    }
  }

  async function handleRegisterSaida(id: number) {
    if (!exitForm.destino || exitForm.id !== id) {
      alert("Informe o destino da saída antes de confirmar");
      return;
    }

    try {
      await api.put(`/equipamentos/${id}`, {
        destino: exitForm.destino,
        status: "saida",
        dataSaida: new Date().toISOString(),
      });
      setExitForm({ destino: "" });
      load();
    } catch (err) {
      alert("Erro ao registrar saída");
    }
  }

  return (
    <div className="list-container">
      <h2 className="list-title">Equipamentos</h2>
      <div className="table-wrapper">
        <table className="equipamentos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Serial</th>
              <th>MAC</th>
              <th>Destino</th>
              <th>Status</th>
              <th>Entrada</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items
              .filter(i => {
                const q = (searchQuery || "").toLowerCase();
                if (!q) return true;
                if (searchField === "nome") return (i.nome || "").toLowerCase().includes(q);
                if (searchField === "serial") return (i.serial || "").toLowerCase().includes(q);
                if (searchField === "mac") return (i.mac || "").toLowerCase().includes(q);
                // all
                return (
                  (i.nome || "").toLowerCase().includes(q) ||
                  (i.serial || "").toLowerCase().includes(q) ||
                  (i.mac || "").toLowerCase().includes(q)
                );
              })
              .map(i => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.nome}</td>
                <td>{i.serial || "—"}</td>
                <td>{i.mac || "—"}</td>
                <td>{i.destino || "—"}</td>
                <td><span className="status-badge">{i.status}</span></td>
                <td>{new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                }).format(new Date(i.dataEntrada))}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(i.id)}
                    >
                      Excluir
                    </button>

                    {exitForm.id === i.id ? (
                      <div className="exit-form">
                        <input
                          value={exitForm.destino}
                          placeholder="Destino da saída"
                          onChange={e => setExitForm({ ...exitForm, destino: e.target.value })}
                        />
                        <button className="btn-primary" onClick={() => handleRegisterSaida(i.id)}>Confirmar</button>
                        <button className="btn-delete" onClick={() => setExitForm({ destino: "" })}>Cancelar</button>
                      </div>
                    ) : (
                      <button
                        className="btn-primary"
                        onClick={() => setExitForm({ id: i.id, destino: i.destino || "" })}
                      >
                        Registrar Saída
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && items.length === 0 && (
          <div className="empty-state">
            Nenhum equipamento cadastrado
          </div>
        )}
      </div>
    </div>
  );
}
