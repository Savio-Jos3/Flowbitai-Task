// src/router.ts
import { Router } from 'express';
import getStats from './handlers/stats';
import { getCategorySpend,getInvoiceTrends, getCashOutflow } from './handlers/analytics';
import { getTopVendors, } from './handlers/vendors';

//import getTopVendors from './handlers/vendors';
// ...import others as you build them

const router = Router();

// Mount endpoints
router.get('/stats', getStats);       // GET /api/stats
router.get('/category-spend', getCategorySpend);
router.get('/invoice-trends', getInvoiceTrends);
router.get('/vendors/top10', getTopVendors);
router.get('/cash-outflow', getCashOutflow);

//outer.get('/vendors/top10', getTopVendors); // GET /api/vendors/top10
// ...add more

export default router;
