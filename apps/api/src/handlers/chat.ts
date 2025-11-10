import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

const VANNA_API_URL = process.env.VANNA_API_BASE_URL || 'http://localhost:8000';

export async function chatWithData(req: Request, res: Response, next: NextFunction) {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    // User is already authenticated by middleware!
    // req.user exists here because of authenticateToken
    console.log(`User ${req.user.email} asked: ${question}`);

    // Forward request to Vanna AI service
    const response = await axios.post(`${VANNA_API_URL}/query`, {
      question
    }, {
      timeout: 30000 // 30 second timeout
    });

    // Return Vanna's response
    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Vanna AI error:', error);
    
    if (axios.isAxiosError(error)) {
      return res.status(500).json({
        success: false,
        error: error.response?.data?.detail || 'Failed to process question'
      });
    }

    next(error);
  }
}
