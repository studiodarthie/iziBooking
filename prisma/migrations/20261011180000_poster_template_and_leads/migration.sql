-- AlterTable
ALTER TABLE "PosterCampaign"
  ADD COLUMN "templatePublicId" TEXT,
  ADD COLUMN "templateWidth" INTEGER,
  ADD COLUMN "templateHeight" INTEGER,
  ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "maxPerPerson" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "PosterLead" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isWhatsapp" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "consentedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PosterLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PosterLead_campaignId_phone_key" ON "PosterLead"("campaignId", "phone");

-- AddForeignKey
ALTER TABLE "PosterLead" ADD CONSTRAINT "PosterLead_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PosterCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
