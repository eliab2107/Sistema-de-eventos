/*
  Warnings:

  - Added the required column `creatorId` to the `Participante` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Participante" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "Participante_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Participante" ("email", "id", "nome") SELECT "email", "id", "nome" FROM "Participante";
DROP TABLE "Participante";
ALTER TABLE "new_Participante" RENAME TO "Participante";
CREATE UNIQUE INDEX "Participante_email_key" ON "Participante"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
