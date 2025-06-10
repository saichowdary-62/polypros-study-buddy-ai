
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Chat function called with method:', req.method)
    
    const { message } = await req.json()
    console.log('Received message:', message)

    if (!message) {
      throw new Error('Message is required')
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    console.log('OpenAI API key exists:', !!openaiApiKey)
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log('Making request to OpenAI...')
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are PolyPros, an AI study assistant specifically designed for polytechnic students. You help with Engineering Mathematics, Computer Science, Electronics, Mechanical Engineering, Civil Engineering, and other polytechnic subjects. Provide clear, educational explanations and solutions. Always be helpful and encouraging to students. Format your responses clearly with proper spacing and structure. Be conversational and engaging like ChatGPT.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    console.log('OpenAI response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API Error:', errorData)
      
      if (response.status === 429) {
        throw new Error("I'm currently experiencing high demand. Please try again in a few minutes.")
      } else if (response.status === 401) {
        throw new Error("API configuration error. Please contact support.")
      } else {
        throw new Error(`Service temporarily unavailable (${response.status}). Please try again.`)
      }
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content
    console.log('AI response generated successfully')

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Chat function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred. Please try again.' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
