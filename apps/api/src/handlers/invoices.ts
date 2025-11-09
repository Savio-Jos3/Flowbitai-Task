import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

// Define validation schema
const invoiceQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.string().trim().optional(),
  dateFrom: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  dateTo: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  vendorId: z.string().uuid('Invalid vendor ID format').optional(),
  customerId: z.string().uuid('Invalid customer ID format').optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10)
});

export async function listInvoices(req: Request, res: Response, next: NextFunction) {
  try {
    // Validate and parse query parameters
    const validationResult = invoiceQuerySchema.safeParse(req.query);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: validationResult.error.format()
      });
    }

    const { search, status, dateFrom, dateTo, vendorId, customerId, page, pageSize } = validationResult.data;

    // Build where clause
    const where: any = {};

    // Free-text search (invoice number)
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      where.invoiceDate = {};
      if (dateFrom) {
        try {
          where.invoiceDate.gte = new Date(dateFrom);
        } catch (err) {
          return res.status(400).json({
            success: false,
            error: 'Invalid dateFrom format. Use YYYY-MM-DD or ISO 8601.'
          });
        }
      }
      if (dateTo) {
        try {
          where.invoiceDate.lte = new Date(dateTo);
        } catch (err) {
          return res.status(400).json({
            success: false,
            error: 'Invalid dateTo format. Use YYYY-MM-DD or ISO 8601.'
          });
        }
      }
    }

    // Filter by vendor
    if (vendorId) {
      where.vendorId = vendorId;
    }

    // Filter by customer
    if (customerId) {
      where.customerId = customerId;
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch invoices and total count in a transaction
    const [invoices, total] = await prisma.$transaction([
      prisma.invoice.findMany({
        where,
        skip,
        take,
        orderBy: { invoiceDate: 'desc' },
        select: {
          id: true,
          invoiceNumber: true,
          vendorId: true,
          customerId: true,
          invoiceDate: true,
          deliveryDate: true,
          invoiceTotal: true,
          status: true,
          documentId: true
        }
      }),
      prisma.invoice.count({ where })
    ]);

    // Return successful response
    res.status(200).json({
      success: true,
      data: {
        invoices,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });

  } catch (err) {
    // Log error for debugging
    console.error('Error in listInvoices:', err);
    next(err);
  }
}
