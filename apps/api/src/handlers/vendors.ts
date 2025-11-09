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
    // Optionally join Vendor names in a follow-up query or map
    res.json(vendors);
  } catch (err) {
    next(err);
  }
}
