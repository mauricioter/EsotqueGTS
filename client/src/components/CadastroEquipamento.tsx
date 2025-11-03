import React, { useState } from "react";
import api from "../services/api";
import "./CadastroEquipamento.css";

export default function CadastroEquipamento() {
  const [form, setForm] = useState({ nome: "", serial: "", mac: "", destino: "" });
  const [mensagem, setMensagem] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/equipamentos", form);
      setMensagem("Equipamento cadastrado com sucesso!");
      setForm({ nome: "", serial: "", mac: "", destino: "" });
      window.dispatchEvent(new Event("equipamento:changed"));
    } catch (err: any) {
      setMensagem(err.response?.data?.error || "Erro ao cadastrar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="cadastro-container">
      <h2 className="cadastro-title">Cadastrar Equipamento</h2>

      <form className="cadastro-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="nome">Nome <span className="required-star">*</span></label>
          <input
            id="nome"
            placeholder="Nome do equipamento"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="serial">Serial</label>
            <input
              id="serial"
              placeholder="Serial (opcional)"
              value={form.serial}
              onChange={e => setForm({ ...form, serial: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="mac">MAC</label>
            <input
              id="mac"
              placeholder="MAC (opcional)"
              value={form.mac}
              onChange={e => setForm({ ...form, mac: e.target.value })}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="destino">Destino</label>
          <input
            id="destino"
            placeholder="Destino (opcional)"
            value={form.destino}
            onChange={e => setForm({ ...form, destino: e.target.value })}
          />
        </div>

        <div className="btn-row">
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </form>

      {mensagem && <p className="msg">{mensagem}</p>}
    </div>
  );
}
