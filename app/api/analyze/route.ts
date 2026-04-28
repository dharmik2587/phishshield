import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.CLAUDE_API_KEY) {
      console.error('Missing CLAUDE_API_KEY environment variable');
      return NextResponse.json({ error: 'API Configuration Error' }, { status: 500 });
    }

    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL required' }, { status: 400 });
    }

    const prompt = `Perform a high-precision forensic analysis on the following URL: ${url}

Your objective is to provide a non-generic, data-driven security assessment. Do not use canned responses. Analyze the specific string characteristics of the domain provided.

Evaluation Criteria:
1. Entropy Analysis: Check for random string generation or unusual character distributions in subdomains.
2. Typosquatting/Homoglyphs: Check for subtle character replacements (e.g., 'o' vs '0', 'l' vs '1', Cyrillic characters) mimicking major brands like MetaMask, Coinbase, Uniswap, Binance, or Ledger.
3. TLD Reputation: Evaluate the risk of the Top-Level Domain (e.g., .xyz, .pw, .top, .zip are high-risk).
4. Brand Impersonation: Does the URL use brand names as subdomains or path segments to deceive?
5. SSL/Path Indicators: Look for patterns like '/login', '/secure', '/verify-seed' on suspicious domains.

Confidence Calculation (Must be a specific number based on your findings):
- 95-100: Definitive match for known phishing patterns (e.g., "metam-mask.io").
- 70-90: High suspicion based on multiple red flags (e.g., high-risk TLD + brand name in subdomain).
- 40-60: Ambiguous or new domain with suspicious naming but no definitive impersonation.
- 0-10: Established, high-reputation domain (e.g., google.com, uniswap.org).

Return ONLY valid JSON:
{
  "verdict": "Safe" | "Phishing",
  "confidence": <integer_0_100>,
  "reasons": ["Specific finding 1", "Specific finding 2", ...],
  "action_advice": "Technical recommendation for the user"
}

Note: If the URL is "https://app.uniswap.org", the confidence should be 100% (Safe). If it is "https://uniswap-claim.xyz", the confidence should be ~98% (Phishing). Be precise.`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 500,
      temperature: 0,
      system: "You are a specialized security analyst for cryptocurrency phishing. Analyze URLs for malicious patterns and return ONLY valid JSON.",
      messages: [{ role: 'user', content: prompt }],
    });

    console.log('Claude API Response Received');

    if (!response.content || response.content.length === 0) {
      throw new Error('Empty response from Claude API');
    }

    const content = response.content[0];
    if (content.type !== 'text') {
      console.error('Unexpected content type:', content.type);
      throw new Error(`Unexpected response format: ${content.type}`);
    }

    let rawText = content.text.trim();
    console.log('Raw AI Text:', rawText);
    
    // Robust JSON extraction
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in text:', rawText);
      throw new Error('No JSON found in AI response');
    }
    
    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error('JSON Parse Error:', jsonMatch[0]);
      throw new Error('Failed to parse AI JSON response');
    }

    if (!parsed.verdict || typeof parsed.confidence !== 'number' || !Array.isArray(parsed.reasons) || !parsed.action_advice) {
      console.error('Incomplete JSON structure:', parsed);
      throw new Error('Incomplete AI response structure');
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('DETAILED ANALYSIS ERROR:', {
      message: error?.message,
      stack: error?.stack,
      status: error?.status,
      name: error?.name
    });
    
    let errorMessage = 'Analysis failed. Please try again.';
    
    if (error?.status === 401) {
      errorMessage = 'Invalid API Key. Please check your CLAUDE_API_KEY in .env.local';
    } else if (error?.status === 429) {
      errorMessage = 'Rate limit exceeded or insufficient credits in Anthropic account.';
    } else if (error?.message) {
      errorMessage = `Analysis Error: ${error.message}`;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: error?.status || 500 }
    );
  }
}
