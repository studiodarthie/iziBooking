-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN     "occasions" TEXT[] DEFAULT ARRAY[]::TEXT[];
