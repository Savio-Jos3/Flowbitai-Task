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
    const trends = await prisma.invoice.groupBy({
      by: ["invoiceDate"],
      _count: { id: true },  // or your PK field name
      _sum: { invoiceTotal: true }
    });
    res.json(trends);
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
