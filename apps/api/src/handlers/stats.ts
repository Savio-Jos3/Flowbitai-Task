import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export default async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    // (Fill in actual analytics query here, e.g. count, totals...)
    const invoiceCount = await prisma.invoice.count();
    res.json({ invoiceCount });
  } catch (err) {
    console.error(err);
    next(err); // Pass errors to global error handler
  }
}
