import { Router } from "express";
import { createEquipamento, listEquipamentos, deleteEquipamento, updateEquipamento } from "./controllers/equipamentosController";

const router = Router();

router.post("/equipamentos", createEquipamento);
router.get("/equipamentos", listEquipamentos);
router.delete("/equipamentos/:id", deleteEquipamento);
router.put("/equipamentos/:id", updateEquipamento);

export default router;
