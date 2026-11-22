-- CreateTable
CREATE TABLE "EspecieMascote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagemUrl" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "CompanheiroMascote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "especieId" TEXT NOT NULL,
    "experiencia" INTEGER NOT NULL DEFAULT 0,
    "equipado" BOOLEAN NOT NULL DEFAULT false,
    "formaSelecionada" TEXT NOT NULL DEFAULT 'despertar',
    "corAura" TEXT NOT NULL DEFAULT 'violeta',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "CompanheiroMascote_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CompanheiroMascote_especieId_fkey" FOREIGN KEY ("especieId") REFERENCES "EspecieMascote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventoMascote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companheiroId" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "pontos" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventoMascote_companheiroId_fkey" FOREIGN KEY ("companheiroId") REFERENCES "CompanheiroMascote" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PreferenciasMascote" (
    "usuarioId" TEXT NOT NULL PRIMARY KEY,
    "visivel" BOOLEAN NOT NULL DEFAULT true,
    "acompanhar" BOOLEAN NOT NULL DEFAULT true,
    "posicao" TEXT NOT NULL DEFAULT 'direita',
    CONSTRAINT "PreferenciasMascote_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CompanheiroMascote_usuarioId_equipado_idx" ON "CompanheiroMascote"("usuarioId", "equipado");

-- CreateIndex
CREATE UNIQUE INDEX "CompanheiroMascote_usuarioId_especieId_key" ON "CompanheiroMascote"("usuarioId", "especieId");

-- CreateIndex
CREATE INDEX "EventoMascote_companheiroId_criadoEm_idx" ON "EventoMascote"("companheiroId", "criadoEm");

-- CreateIndex
CREATE UNIQUE INDEX "EventoMascote_companheiroId_chave_key" ON "EventoMascote"("companheiroId", "chave");
