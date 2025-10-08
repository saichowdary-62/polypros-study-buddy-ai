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
    
    const { message, conversationHistory = [] } = await req.json()
    console.log('Received message:', message)
    console.log('Conversation history length:', conversationHistory.length)

    if (!message) {
      throw new Error('Message is required')
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
    console.log('Lovable API key exists:', !!lovableApiKey)
    
    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'AI service not configured. Please contact support.' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Build messages array with system prompt and conversation history
    const messages = [
      {
        role: 'system',
        content: `You are PolyPros, a helpful study assistant that provides direct answers to any question asked.

CREATOR INFORMATION: If anyone asks who created this AI or about the creator, respond that this AI was created by Sai Amarnadh, the founder of Ropebit Labs.

GUIDELINES:
- Answer ANY question directly without asking for clarification
- Use conversation history to understand context and provide relevant answers
- When user asks for "answers" or "for X marks", refer to the previous topic discussed
- Provide helpful, accurate information on any topic asked
- For programming topics, include brief code examples when relevant
- For mathematics, provide formulas and explanations
- Use bullet points for lists to keep organized
- Be concise but comprehensive in your responses
- If you need to clarify something, do so while still providing a helpful answer`
      },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      })),
      {
        role: 'user',
        content: message
      }
    ]

    console.log('Making request to Lovable AI...')
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    console.log('AI response status:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Lovable AI Error:', response.status, errorData)
      
      let userFriendlyMessage = 'Sorry, I encountered an error. Please try again.'
      
      if (response.status === 429) {
        userFriendlyMessage = "I'm currently experiencing high demand. Please wait a moment and try again."
      } else if (response.status === 402) {
        userFriendlyMessage = "AI service credits depleted. Please contact support."
      } else if (response.status === 401) {
        userFriendlyMessage = "There's an issue with the AI configuration. Please contact support."
      }
      
      return new Response(
        JSON.stringify({ error: userFriendlyMessage }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
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
        status: 200,
      },
    )
  }
})
