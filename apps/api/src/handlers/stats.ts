import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

// Main stats endpoint with month-over-month trends
export default async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // This month's stats
    const [invoiceCount, totalSpend] = await Promise.all([
      prisma.invoice.count({
        where: {
          invoiceDate: {
            gte: startOfMonth
          }
        }
      }),
      prisma.invoice.aggregate({
        where: {
          invoiceDate: {
            gte: startOfMonth
          }
        },
        _sum: {
          invoiceTotal: true
        }
      })
    ]);

    // Last month's stats
    const [lastMonthCount, lastMonthSpend] = await Promise.all([
      prisma.invoice.count({
        where: {
          invoiceDate: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      prisma.invoice.aggregate({
        where: {
          invoiceDate: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        },
        _sum: {
          invoiceTotal: true
        }
      })
    ]);

    // Calculate trends
    const countTrend = lastMonthCount > 0
      ? ((invoiceCount - lastMonthCount) / lastMonthCount * 100).toFixed(1)
      : 0;

    const currentSpend = Math.abs(totalSpend._sum.invoiceTotal || 0);
    const lastSpend = Math.abs(lastMonthSpend._sum.invoiceTotal || 0);
    
    const spendTrend = lastSpend > 0
      ? ((currentSpend - lastSpend) / lastSpend * 100).toFixed(1)
      : 0;

    const avgValue = invoiceCount > 0 ? currentSpend / invoiceCount : 0;
    const lastAvgValue = lastMonthCount > 0 ? lastSpend / lastMonthCount : 0;

    const avgTrend = lastAvgValue > 0
      ? ((avgValue - lastAvgValue) / lastAvgValue * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        invoiceCount,
        totalSpend: currentSpend,
        avgInvoiceValue: avgValue,
        trends: {
          invoiceCount: {
            value: Math.abs(Number(countTrend)),
            isPositive: Number(countTrend) >= 0
          },
          totalSpend: {
            value: Math.abs(Number(spendTrend)),
            isPositive: Number(spendTrend) >= 0
          },
          avgValue: {
            value: Math.abs(Number(avgTrend)),
            isPositive: Number(avgTrend) >= 0
          }
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

// Document stats endpoint
export async function getDocumentStats(req: Request, res: Response, next: NextFunction) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const thisMonth = await prisma.invoice.count({
      where: {
        invoiceDate: {
          gte: startOfMonth
        }
      }
    });

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    const lastMonth = await prisma.invoice.count({
      where: {
        invoiceDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      }
    });

    const percentChange = lastMonth > 0 
      ? ((thisMonth - lastMonth) / lastMonth * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        thisMonth,
        lastMonth,
        percentChange: Number(percentChange),
        isPositive: Number(percentChange) >= 0
      }
    });
  } catch (err) {
    next(err);
  }
}
