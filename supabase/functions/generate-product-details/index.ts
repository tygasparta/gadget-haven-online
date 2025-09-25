
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('Generating product details with prompt:', prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are an expert e-commerce product manager. Generate compelling product details that will help products sell well. 

IMPORTANT: You must respond with ONLY valid JSON. Do not include any markdown formatting, explanations, or additional text. The response should be a raw JSON object that can be parsed directly.

CRITICAL: Always include a "specifications" array with REAL specification names based on the product type. NEVER use generic names like "Feature 1", "Feature 2", etc.

Based on the product type, use these REAL specification names:

For tablets/iPads: 
- "Display": "10.9-inch Liquid Retina display"
- "Storage": "64GB/256GB/512GB"  
- "Processor": "A14 Bionic chip"
- "Connectivity": "Wi-Fi 6, Bluetooth 5.0"
- "Battery Life": "Up to 10 hours"
- "Operating System": "iPadOS 16"
- "Weight": "461 grams"
- "Dimensions": "247.6 x 178.5 x 6.1 mm"
- "Camera": "12MP rear, 12MP front"

For smartphones:
- "Display": "6.7-inch AMOLED, 2800x1260"
- "Storage": "128GB/256GB/512GB internal"
- "RAM": "8GB/12GB RAM"
- "Processor": "Snapdragon 8 Gen 2"
- "Battery": "4500mAh with 25W fast charging"
- "Camera": "108MP triple camera system"
- "Operating System": "Android 14"
- "Connectivity": "5G, Wi-Fi 6, Bluetooth 5.2"

For laptops:
- "Display": "13.3-inch Retina, 2560x1600"
- "Processor": "Intel Core i5/i7 or Apple M1/M2"
- "RAM": "8GB/16GB/32GB"
- "Storage": "256GB/512GB/1TB SSD"
- "Graphics": "Integrated Intel Iris Xe"
- "Operating System": "Windows 11 or macOS"
- "Battery Life": "Up to 12 hours"
- "Weight": "1.4 kg"

The JSON structure must be exactly:
{
  "name": "Product name",
  "description": "Product description (2-3 sentences)",
  "category": "Category from: Smartphones, Laptops, Tablets, Headphones, Cameras, Gaming, Accessories, Smart Watches, Audio, Home & Garden, Electronics",
  "brand": "Brand name",
  "price": 299.99,
  "features": ["Real feature 1", "Real feature 2", "Real feature 3"],
  "whats_in_box": ["Item 1", "Item 2", "Item 3"],
  "tags": ["tag1", "tag2", "tag3"],
  "specifications": [
    {"key": "Display", "value": "10.9-inch Liquid Retina display"},
    {"key": "Storage", "value": "256GB internal storage"},
    {"key": "Processor", "value": "A14 Bionic chip"},
    {"key": "RAM", "value": "8GB RAM"},
    {"key": "Battery Life", "value": "Up to 10 hours"},
    {"key": "Operating System", "value": "iPadOS 16"}
  ]
}

MANDATORY: The specifications array MUST contain at least 5-8 real specifications with proper technical names, not generic placeholders.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || `OpenAI API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response structure from OpenAI');
    }

    const generatedData = data.choices[0].message.content;

    console.log('Generated product details:', generatedData);

    // Validate that the response is valid JSON
    let parsedData;
    try {
      parsedData = JSON.parse(generatedData);
    } catch (parseError) {
      console.error('Generated data is not valid JSON:', generatedData);
      throw new Error('AI generated invalid JSON format');
    }

    // Ensure specifications array exists and has proper format
    if (!parsedData.specifications || !Array.isArray(parsedData.specifications) || parsedData.specifications.length === 0) {
      console.error('Missing or invalid specifications array in generated data');
      throw new Error('AI failed to generate proper specifications');
    }

    // Validate specifications have proper structure
    const hasValidSpecs = parsedData.specifications.every((spec: any) => 
      spec.key && spec.value && 
      typeof spec.key === 'string' && 
      typeof spec.value === 'string' &&
      !spec.key.toLowerCase().includes('feature')
    );

    if (!hasValidSpecs) {
      console.error('Specifications contain invalid or generic names:', parsedData.specifications);
      throw new Error('AI generated specifications with invalid names');
    }

    return new Response(JSON.stringify({ generatedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in generate-product-details function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      details: error.stack || 'No additional details available'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
