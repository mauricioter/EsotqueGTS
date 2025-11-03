import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createEquipamento(req: Request, res: Response) {
  try {
    const { nome, serial, mac, destino, status } = req.body;

    const serialNormalized = serial ? String(serial).trim() : null;
    const macNormalized = mac ? String(mac).trim().toLowerCase() : null;

    if (serialNormalized) {
      const existsSerial = await prisma.equipamento.findFirst({ where: { serial: serialNormalized } });
      if (existsSerial) return res.status(400).json({ error: "Serial já cadastrado" });
    }
    if (macNormalized) {
      const existsMac = await prisma.equipamento.findFirst({ where: { mac: macNormalized } });
      if (existsMac) return res.status(400).json({ error: "MAC já cadastrado" });
    }

    const equipamento = await prisma.equipamento.create({
      data: {
        nome,
        serial: serialNormalized,
        mac: macNormalized,
        destino,
        status: status || "estoque",
      },
    });

    return res.json(equipamento);
  } catch (err: any) {
    if (err?.code === "P2002") {
      const target = (err.meta && err.meta.target) ? err.meta.target : "valor único";
      return res.status(400).json({ error: `Violação de unicidade: ${JSON.stringify(target)}` });
    }

    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

export async function listEquipamentos(_req: Request, res: Response) {
  const equipamentos = await prisma.equipamento.findMany({ orderBy: { id: "desc" } });
  res.json(equipamentos);
}

export async function deleteEquipamento(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await prisma.equipamento.delete({ where: { id: Number(id) } });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: "Não foi possível deletar" });
  }
}

export async function updateEquipamento(req: Request, res: Response) {
  const { id } = req.params;
  const { nome, serial, mac, destino, status, dataSaida } = req.body;

  try {
    const serialNormalized = serial ? String(serial).trim() : null;
    const macNormalized = mac ? String(mac).trim().toLowerCase() : null;

    if (serialNormalized) {
      const found = await prisma.equipamento.findFirst({ where: { serial: serialNormalized, NOT: { id: Number(id) } } });
      if (found) return res.status(400).json({ error: "Serial já cadastrado em outro equipamento" });
    }
    if (macNormalized) {
      const found = await prisma.equipamento.findFirst({ where: { mac: macNormalized, NOT: { id: Number(id) } } });
      if (found) return res.status(400).json({ error: "MAC já cadastrado em outro equipamento" });
    }

    const updated = await prisma.equipamento.update({
      where: { id: Number(id) },
      data: { nome, serial: serialNormalized, mac: macNormalized, destino, status, dataSaida },
    });

    res.json(updated);
  } catch (err: any) {
    if (err?.code === "P2002") return res.status(400).json({ error: "Violação de unicidade" });
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar" });
  }
}
