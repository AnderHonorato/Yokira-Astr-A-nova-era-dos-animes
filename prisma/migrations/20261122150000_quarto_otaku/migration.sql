CREATE TABLE "QuartoOtaku" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "tema" TEXT NOT NULL DEFAULT 'observatorio',
    "iluminacao" TEXT NOT NULL DEFAULT 'luar',
    "publico" BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "QuartoOtaku_usuarioId_key" ON "QuartoOtaku"("usuarioId");

CREATE TABLE "ObjetoQuarto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quartoId" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "tituloId" TEXT,
    "x" INTEGER NOT NULL DEFAULT 50,
    "y" INTEGER NOT NULL DEFAULT 65,
    "rotacao" INTEGER NOT NULL DEFAULT 0,
    "colocado" BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY ("quartoId") REFERENCES "QuartoOtaku" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("tituloId") REFERENCES "Titulo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ObjetoQuarto_quartoId_chave_key" ON "ObjetoQuarto"("quartoId", "chave");
