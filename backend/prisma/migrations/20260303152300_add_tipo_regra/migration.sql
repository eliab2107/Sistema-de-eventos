/*
  Warnings:

  - Added the required column `tipoRegraId` to the `RegraEvento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "TipoRegra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RegraEvento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "minutosAntes" INTEGER NOT NULL,
    "minutosDepois" INTEGER NOT NULL,
    "obrigatorio" BOOLEAN NOT NULL DEFAULT true,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventoId" TEXT NOT NULL,
    "tipoRegraId" TEXT NOT NULL,
    CONSTRAINT "RegraEvento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RegraEvento_tipoRegraId_fkey" FOREIGN KEY ("tipoRegraId") REFERENCES "TipoRegra" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RegraEvento" ("ativa", "criadoEm", "eventoId", "id", "minutosAntes", "minutosDepois", "nome", "obrigatorio") SELECT "ativa", "criadoEm", "eventoId", "id", "minutosAntes", "minutosDepois", "nome", "obrigatorio" FROM "RegraEvento";
DROP TABLE "RegraEvento";
ALTER TABLE "new_RegraEvento" RENAME TO "RegraEvento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "TipoRegra_nome_key" ON "TipoRegra"("nome");
