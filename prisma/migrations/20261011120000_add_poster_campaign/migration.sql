-- CreateEnum
CREATE TYPE "PosterTheme" AS ENUM ('BRIQUE', 'DORE', 'FORET');

-- CreateTable
CREATE TABLE "PosterCampaign" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3),
    "theme" "PosterTheme" NOT NULL DEFAULT 'BRIQUE',
    "slug" TEXT NOT NULL,
    "generatedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PosterCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PosterCampaign_slug_key" ON "PosterCampaign"("slug");

-- AddForeignKey
ALTER TABLE "PosterCampaign" ADD CONSTRAINT "PosterCampaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
