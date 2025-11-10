import { Router } from 'express';
import getStats, { getDocumentStats } from './handlers/stats';
import { getInvoiceTrends, getCategorySpend, getCashOutflow } from './handlers/analytics';
import { getTopVendors } from './handlers/vendors';
import { listInvoices } from './handlers/invoices';
import { chatWithData } from './handlers/chat';
import { register, login, verifyEmail } from './handlers/auth';
import { authenticateToken } from './middleware/auth';

const router = Router();

// Public routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/verify', verifyEmail);

// Protected routes
router.get('/stats', authenticateToken, getStats);
router.get('/document-stats', authenticateToken, getDocumentStats);
router.get('/invoice-trends', authenticateToken, getInvoiceTrends);
router.get('/vendors/top10', authenticateToken, getTopVendors);
router.get('/cash-outflow', authenticateToken, getCashOutflow);
router.get('/category-spend', authenticateToken, getCategorySpend);
router.get('/invoices', authenticateToken, listInvoices);
router.post('/chat-with-data', authenticateToken, chatWithData);

export default router;
