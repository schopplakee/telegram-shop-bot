-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "telegramId" TEXT NOT NULL,
    "step" TEXT,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_telegramId_key" ON "Session"("telegramId");
