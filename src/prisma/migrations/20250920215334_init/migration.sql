-- CreateTable
CREATE TABLE "public"."Comentario" (
    "id" SERIAL NOT NULL,
    "livroSlug" TEXT NOT NULL,
    "capitulo" INTEGER NOT NULL,
    "versiculo" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Referencia" (
    "id" SERIAL NOT NULL,
    "livroSlug" TEXT NOT NULL,
    "capitulo" INTEGER NOT NULL,
    "versiculo" INTEGER NOT NULL,
    "referencia" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referencia_pkey" PRIMARY KEY ("id")
);
