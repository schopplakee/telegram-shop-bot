-- DropForeignKey
ALTER TABLE "Server" DROP CONSTRAINT "Server_panelId_fkey";

-- AlterTable
ALTER TABLE "Server" ALTER COLUMN "panelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "Panel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
