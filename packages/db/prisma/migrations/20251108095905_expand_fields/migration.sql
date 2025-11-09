-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "taxId" TEXT;

-- AlterTable
ALTER TABLE "InvoiceSummary" ADD COLUMN     "documentType" TEXT,
ADD COLUMN     "locale" TEXT;

-- AlterTable
ALTER TABLE "LineItem" ADD COLUMN     "vatAmount" DOUBLE PRECISION,
ADD COLUMN     "vatRate" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "accountName" TEXT,
ADD COLUMN     "discountDays" INTEGER,
ADD COLUMN     "discountDueDate" TIMESTAMP(3),
ADD COLUMN     "discountPercentage" DOUBLE PRECISION,
ADD COLUMN     "discountedTotal" DOUBLE PRECISION,
ADD COLUMN     "netDays" INTEGER;
