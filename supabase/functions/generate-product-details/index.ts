
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

CRITICAL: When generating specifications, use REAL specification names, NOT generic placeholders like "Feature 1", "Feature 2", etc. Use proper technical specification names based on the product type:

For smartphones: "Display", "Storage", "RAM", "Processor", "Battery", "Camera", "Operating System", "Weight", "Dimensions", "Connectivity", "Color Options", "Warranty"
For laptops: "Display", "Processor", "RAM", "Storage", "Graphics", "Operating System", "Battery Life", "Weight", "Dimensions", "Ports", "Wireless", "Warranty" 
For headphones: "Driver Size", "Frequency Response", "Impedance", "Battery Life", "Connectivity", "Noise Cancellation", "Weight", "Warranty"
For cameras: "Sensor", "Lens Mount", "ISO Range", "Video Recording", "Display", "Storage", "Battery Life", "Weight", "Dimensions", "Connectivity", "Warranty"

The JSON structure should be:
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
    {"key": "Display", "value": "6.7-inch AMOLED, 2800x1260"},
    {"key": "Storage", "value": "256GB internal storage"},
    {"key": "RAM", "value": "8GB RAM"}
  ]
}

Example of GOOD specifications:
✅ {"key": "Display", "value": "6.1-inch Super Retina XDR OLED"}
✅ {"key": "Processor", "value": "A17 Pro chip"}
✅ {"key": "Storage", "value": "128GB internal storage"}

Example of BAD specifications (DO NOT USE):
❌ {"key": "Feature 1", "value": "Great display"}
❌ {"key": "Feature 2", "value": "Fast processor"}` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
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
    try {
      JSON.parse(generatedData);
    } catch (parseError) {
      console.error('Generated data is not valid JSON:', generatedData);
      throw new Error('AI generated invalid JSON format');
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
