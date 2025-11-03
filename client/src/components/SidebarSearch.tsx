import React, { useState } from "react";

type Props = {
  onSearch: (query: string, field: string) => void;
};

export default function SidebarSearch({ onSearch }: Props) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState("all");

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    onSearch(query.trim(), field);
  }

  return (
    <aside className="sidebar">
      <h3 className="small-muted">Pesquisar equipamentos</h3>
      <form onSubmit={submit} style={{ marginTop: 10 }}>
        <div className="search-field">
          <input
            placeholder="Nome, Serial ou MAC"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label className="small-muted">Filtrar por</label>
          <div style={{ marginTop: 6 }}>
            <select value={field} onChange={e => setField(e.target.value)}>
              <option value="all">Todos (Nome / Serial / MAC)</option>
              <option value="nome">Nome</option>
              <option value="serial">Serial</option>
              <option value="mac">MAC</option>
            </select>
          </div>
        </div>

        <div className="search-actions">
          <button type="button" className="btn-delete" onClick={() => { setQuery(""); setField("all"); onSearch("", "all"); }}>
            Limpar
          </button>
          <button type="submit" className="btn-primary">Pesquisar</button>
        </div>

        <p className="small-muted" style={{ marginTop: 12 }}>Pesquise por trechos do nome, serial ou MAC. Ex.: "4684" ou "raspberry"</p>
      </form>
    </aside>
  );
}
