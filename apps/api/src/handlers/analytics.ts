import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export async function getCategorySpend(req: Request, res: Response, next: NextFunction) {
  try {
    const spendByCategory = await prisma.lineItem.groupBy({
      by: ['sachkonto'], 
      _sum: { totalPrice: true }
    });
    res.json(spendByCategory);
  } catch (err) {
    next(err);
  }
}

export async function getInvoiceTrends(req: Request, res: Response, next: NextFunction) {
  try {
    // REMOVE the date filter to show all data
    const trends = await prisma.invoice.groupBy({
      by: ['invoiceDate'],
      // Remove this:
      // where: {
      //   invoiceDate: {
      //     gte: twelveMonthsAgo
      //   }
      // },
      _count: {
        id: true
      },
      _sum: {
        invoiceTotal: true
      },
      orderBy: {
        invoiceDate: 'asc'
      }
    });

    // Group by month
    const monthlyData = trends.reduce((acc: any, item) => {
      if (!item.invoiceDate) return acc;
      
      const month = item.invoiceDate.toISOString().substring(0, 7);
      
      if (!acc[month]) {
        acc[month] = { 
          month, 
          count: 0, 
          sum: 0,
          sortKey: new Date(month + '-01').getTime()
        };
      }
      
      acc[month].count += item._count.id;
      acc[month].sum += Math.abs(item._sum.invoiceTotal || 0);
      
      return acc;
    }, {});

    // Take last 12 data points (not last 12 months)
    const result = Object.values(monthlyData)
      .sort((a: any, b: any) => a.sortKey - b.sortKey)
      .slice(-12) // Show last 12 data points
      .map((item: any) => {
        const { sortKey, ...data } = item;
        return data;
      });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}


export async function getCashOutflow(req: Request, res: Response, next: NextFunction) {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today

    // Define future date ranges
    const ranges = [
      {
        name: '0-7 days',
        start: now,
        end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        name: '8-30 days',
        start: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
        end: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        name: '31-60 days',
        start: new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000),
        end: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
      },
      {
        name: '60+ days',
        start: new Date(now.getTime() + 61 * 24 * 60 * 60 * 1000),
        end: new Date('2099-12-31')
      }
    ];

    // Get unpaid invoices grouped by deliveryDate (due date)
    const cashflowData = await Promise.all(
      ranges.map(async (range) => {
        const result = await prisma.invoice.aggregate({
          where: {
            deliveryDate: {
              gte: range.start,
              lte: range.end
            },
            status: {
              not: 'paid' // Only unpaid invoices
            }
          },
          _sum: {
            invoiceTotal: true
          }
        });

        return {
          range: range.name,
          _sum: {
            amount: Math.abs(result._sum.invoiceTotal || 0)
          },
          paymentDate: range.start.toISOString()
        };
      })
    );

    // Also get invoices with no delivery date (they go into 60+ days)
    const noDateResult = await prisma.invoice.aggregate({
      where: {
        deliveryDate: null,
        status: {
          not: 'paid'
        }
      },
      _sum: {
        invoiceTotal: true
      }
    });

    // Add no-date invoices to the 60+ days bucket
    const lastRange = cashflowData[cashflowData.length - 1];
    lastRange._sum.amount += Math.abs(noDateResult._sum.invoiceTotal || 0);

    res.json({ success: true, data: cashflowData });
  } catch (err) {
    next(err);
  }
}

export async function getDocumentStats(req: Request, res: Response, next: NextFunction) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Count invoices with documents from this month
    const thisMonth = await prisma.invoice.count({
      where: {
        invoiceDate: {
          gte: startOfMonth
        }
      }
    });

    // Count invoices from last month
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

    // Calculate percentage change
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
