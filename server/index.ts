import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize services
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
const stripe = new Stripe(stripeKey, {
  apiVersion: '2026-06-24.dahlia' // Using latest available fallback
});
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'AIzaSy_placeholder' });

// Configure Multer for secure file uploads
const storage = multer.memoryStorage(); // For production, use diskStorage to save APKs
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max file size
});

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// We need raw bodies for Stripe Webhooks, but JSON for everything else
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use(express.json());

// API Endpoints

// 1. Upload APK Endpoint
app.post('/api/upload', upload.single('apk'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    // In a real scenario, we would hash the file and run apktool here
    const fileHash = 'mock_sha256_' + Date.now();
    
    res.json({
      success: true,
      message: 'File securely uploaded and queued for analysis',
      fileDetails: {
        originalname: req.file.originalname,
        size: req.file.size,
        hash: fileHash
      }
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, error: 'File upload failed' });
  }
});

// 2. AI Investigation Endpoint
app.post('/api/investigate', async (req, res) => {
  try {
    const { apkDetails, customPrompt } = req.body;
    
    if (!customPrompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const systemPrompt = `You are ThreatLens Core, an advanced cybersecurity AI.
You are tasked with analyzing the reverse-engineered Android APK metadata.
Respond with a JSON object strictly following this structure:
{
  "purpose": "String",
  "malwareFamily": "String",
  "confidence": "String (e.g. 98%)",
  "executionLogic": "String",
  "credentialTheft": "String",
  "bankingTargets": ["String"],
  "networkBehaviour": "String",
  "persistence": "String",
  "obfuscation": "String"
}`;

    // Contact Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `Target File: ${apkDetails?.filename || 'Unknown'}\n\nTask: ${customPrompt}\n\nReturn JSON.` }]}
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    });

    const aiResponseText = response.text;
    if (!aiResponseText) throw new Error("Empty response from AI");
    
    const parsedReport = JSON.parse(aiResponseText);

    res.json({
      success: true,
      source: 'Gemini 2.5 Flash',
      report: parsedReport
    });
  } catch (error) {
    console.error('AI Investigation Error:', error);
    res.status(500).json({ success: false, error: 'AI Analysis Failed' });
  }
});

// 3. Stripe Checkout Session
app.post('/api/checkout', async (req, res) => {
  try {
    const { userId } = req.body; // Passed from Clerk Auth
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro Max Ultra Plan',
              description: 'Unlimited AI Threat Investigations & Reverse Engineering',
            },
            unit_amount: 199900, // $1,999.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing?payment=cancelled`,
      metadata: {
        userId: userId || 'anonymous',
      }
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ success: false, error: 'Checkout Session Failed' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`ThreatLens Secure Engine running on port ${PORT}`);
});
