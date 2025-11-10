import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, '../../../data/Analytics_Test_Data.json');
  const entries = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`📊 Found ${entries.length} records in JSON file`);
  console.log('🔄 Starting seeding process...\n');

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < entries.length; i++) {
    const record = entries[i];
    
    try {
      // 1. Vendor: find or create
      const vendorData = record?.extractedData?.llmData?.vendor?.value;
      if (!vendorData?.vendorName?.value) {
        console.log(`⚠️  Skipping record ${i + 1}: No vendor name`);
        continue;
      }
      
      let vendor = await prisma.vendor.findFirst({ where: { name: vendorData.vendorName.value } });
      if (!vendor) {
        vendor = await prisma.vendor.create({
          data: {
            name: vendorData.vendorName.value,
            taxId: vendorData.vendorTaxId?.value || null,
            address: vendorData.vendorAddress?.value || null,
            partyNumber: vendorData.vendorPartyNumber?.value || null
          }
        });
      }

      // 2. Customer: find or create
      const customerData = record?.extractedData?.llmData?.customer?.value;
      if (!customerData?.customerName?.value) {
        console.log(`⚠️  Skipping record ${i + 1}: No customer name`);
        continue;
      }
      
      let customer = await prisma.customer.findFirst({ where: { name: customerData.customerName.value } });
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: customerData.customerName.value,
            address: customerData.customerAddress?.value || null
          }
        });
      }

      // 3. Invoice
      const invoiceData = record?.extractedData?.llmData?.invoice?.value;
      if (!invoiceData?.invoiceId?.value) {
        console.log(`⚠️  Skipping record ${i + 1}: No invoice ID`);
        continue;
      }
      
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: invoiceData.invoiceId.value,
          vendorId: vendor.id,
          customerId: customer.id,
          invoiceDate: invoiceData.invoiceDate?.value ? new Date(invoiceData.invoiceDate.value) : null,
          deliveryDate: invoiceData.deliveryDate?.value ? new Date(invoiceData.deliveryDate.value) : null,
          status: record.status || 'processed',
          documentId: record._id || null
        }
      });

      // 4. Line Items
      const lineItemsArr = record?.extractedData?.llmData?.lineItems?.value?.items?.value || [];
      let lineItemsTotal = 0;
      for (const item of lineItemsArr) {
        const price = item.totalPrice?.value || 0;
        lineItemsTotal += price;
        await prisma.lineItem.create({
          data: {
            invoiceId: invoice.id,
            srNo: item.srNo?.value || 0,
            description: item.description?.value || null,
            quantity: item.quantity?.value || 0,
            unitPrice: item.unitPrice?.value || 0,
            totalPrice: price,
            sachkonto: item.Sachkonto?.value != null ? String(item.Sachkonto.value) : null,
            buschluessel: item.BUSchluessel?.value != null ? String(item.BUSchluessel.value) : null
          }
        });
      }

      // 5. Summary
      const summaryData = record?.extractedData?.llmData?.summary?.value;
      let summaryTotal = null;
      if (summaryData && summaryData.invoiceTotal?.value != null) {
        summaryTotal = Number(summaryData.invoiceTotal.value);
        await prisma.invoiceSummary.create({
          data: {
            invoiceId: invoice.id,
            subtotal: summaryData.subTotal?.value || null,
            totalTax: summaryData.totalTax?.value || null,
            invoiceTotal: summaryTotal,
            currencySymbol: summaryData.currencySymbol?.value || null
          }
        });
      }

      // 6. Payment
      const paymentData = record?.extractedData?.llmData?.payment?.value;
      if (paymentData) {
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            paymentDate: paymentData.dueDate?.value ? new Date(paymentData.dueDate.value) : null,
            amount: paymentData.amount?.value != null ? Number(paymentData.amount.value)
                   : summaryTotal != null ? summaryTotal
                   : lineItemsTotal,
            bankAccount: paymentData.bankAccountNumber?.value || null,
            bic: paymentData.BIC?.value || null,
            paymentTerms: paymentData.paymentTerms?.value || null
          }
        });
      }

      // Update invoice total
      let actualTotal = summaryTotal !== null ? summaryTotal : lineItemsTotal;
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { invoiceTotal: actualTotal }
      });

      successCount++;
      
      // Progress log every 10 records
      if ((i + 1) % 10 === 0) {
        console.log(`✅ Processed ${i + 1}/${entries.length} records (${successCount} successful, ${errorCount} errors)`);
      }

    } catch (error) {
      errorCount++;
      console.error(`❌ Error processing record ${i + 1}:`, error instanceof Error ? error.message : error);
      // Continue to next record instead of stopping
      continue;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Seeding completed!`);
  console.log(`📊 Total records: ${entries.length}`);
  console.log(`✅ Successfully seeded: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('='.repeat(60));
}

main()
  .catch(e => {
    console.error('💥 Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
