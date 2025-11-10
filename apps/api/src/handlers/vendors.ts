import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export async function getTopVendors(req: Request, res: Response, next: NextFunction) {
  try {
    const vendors = await prisma.invoice.groupBy({
      by: ['vendorId'],
      _sum: { invoiceTotal: true },
      orderBy: { _sum: { invoiceTotal: 'desc' } },
      take: 10,
    });
    res.json(vendors);
  } catch (err) {
    next(err);
  }
}
