// src/router.ts
import { Router } from 'express';
import getStats from './handlers/stats';
import { getCategorySpend,getInvoiceTrends, getCashOutflow } from './handlers/analytics';
import { getTopVendors, } from './handlers/vendors';
import { listInvoices } from './handlers/invoices';
import { chatWithData } from './handlers/chat';
import { register, login } from './handlers/auth';
import { authenticateToken } from './middleware/auth';

//import getTopVendors from './handlers/vendors';
// ...import others as you build them

const router = Router();



// Mount endpoints
router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/invoices', authenticateToken, listInvoices);
router.get('/invoice-trends', authenticateToken, getInvoiceTrends);
router.get('/vendors/top10', authenticateToken, getTopVendors);
router.get('/cash-outflow', authenticateToken, getCashOutflow);
router.get('/category-spend', authenticateToken, getCategorySpend);
router.get('/stats', authenticateToken, getStats);
router.post('/chat-with-data', authenticateToken, chatWithData);



//outer.get('/vendors/top10', getTopVendors); // GET /api/vendors/top10
// ...add more

export default router;
