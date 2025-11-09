import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export async function getCategorySpend(req: Request, res: Response, next: NextFunction) {
  try {
    const spendByCategory = await prisma.lineItem.groupBy({
      by: ['sachkonto'], // Replace with 'category' if you have such a field
      _sum: { totalPrice: true }
    });
    res.json(spendByCategory);
  } catch (err) {
    next(err);
  }
}

export async function getInvoiceTrends(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await prisma.invoice.groupBy({
      by: ["invoiceDate"],
      _count: { id: true },
      _sum: { invoiceTotal: true }
    });
    // Add JS grouping logic here!

    // Group results by month (YYYY-MM)
    const monthly = data.reduce((acc, row) => {
      const date = new Date(row.invoiceDate);
      const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2,'0')}`;
      if (!acc[yearMonth]) acc[yearMonth] = { month: yearMonth, count: 0, sum: 0 };
      acc[yearMonth].count += row._count.id;
      acc[yearMonth].sum += row._sum.invoiceTotal || 0;
      return acc;
    }, {});
    const monthlyTrends = Object.values(monthly);

    res.json(monthlyTrends);
  } catch (err) {
    console.error(err);
    next(err);
  }
}



export async function getCashOutflow(req: Request, res: Response, next: NextFunction) {
  try {
    const payments = await prisma.payment.groupBy({
      by: ['paymentDate'],
      _sum: { amount: true },
      orderBy: { paymentDate: 'asc' }
    });
    res.json(payments);
  } catch (err) {
    next(err);
  }
}
