-- CreateTable
CREATE TABLE "Equipamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "serial" TEXT,
    "mac" TEXT,
    "status" TEXT NOT NULL DEFAULT 'estoque',
    "destino" TEXT,
    "dataEntrada" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataSaida" DATETIME
);
