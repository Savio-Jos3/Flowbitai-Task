import { Request, Response, NextFunction } from 'express';

export async function chatWithData(req: Request, res: Response, next: NextFunction) {
  try {
    const { question } = req.body;
    

    res.json({
      message: "Chat-with-data endpoint coming soon. Vanna AI integration in progress.",
      question,
      sql: null,
      data: null
    });
  } catch (err) {
    next(err);
  }
}
