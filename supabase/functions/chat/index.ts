
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
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured. Please add your OPENAI_API_KEY in the Supabase dashboard.' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
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
        max_tokens: 1500,
      }),
    })

    console.log('OpenAI response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API Error:', errorData)
      
      let userFriendlyMessage = 'Sorry, I encountered an error. Please try again.'
      
      if (response.status === 429) {
        if (errorData.error?.code === 'insufficient_quota') {
          userFriendlyMessage = "It looks like the OpenAI API quota has been exceeded. Please check your OpenAI billing dashboard or try again later."
        } else {
          userFriendlyMessage = "I'm currently experiencing high demand. Please wait a moment and try again."
        }
      } else if (response.status === 401) {
        userFriendlyMessage = "There's an issue with the API configuration. Please contact support."
      } else if (response.status === 400) {
        userFriendlyMessage = "There was an issue with your request. Please try rephrasing your question."
      }
      
      return new Response(
        JSON.stringify({ error: userFriendlyMessage }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Return 200 so the frontend can handle the error gracefully
        },
      )
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content
    console.log('AI response generated successfully, length:', aiResponse.length)

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
        error: 'I encountered an unexpected error. Please try again in a moment.' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 so the frontend can handle the error gracefully
      },
    )
  }
})
