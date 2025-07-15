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

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    console.log('Gemini API key exists:', !!geminiApiKey)
    
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Gemini API key not configured. Please add your GEMINI_API_KEY in the Supabase dashboard.' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    console.log('Making request to Gemini...')
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          ...conversationHistory.slice(-10).map(msg => ({
            parts: [{ text: msg.isBot ? msg.text : msg.text }],
            role: msg.isBot ? 'model' : 'user'
          })),
          {
            parts: [
              {
                text: `You are PolyPros, a helpful study assistant that provides direct answers to any question asked.

CONTEXT: You have access to the conversation history. Use it to understand what the user is referring to when they say things like "give me answers", "for 8 marks", "explain this", etc.

GUIDELINES:
- Answer ANY question directly without asking for clarification
- Use conversation history to understand context and provide relevant answers
- When user asks for "answers" or "for X marks", refer to the previous topic discussed
- Provide helpful, accurate information on any topic asked
- For programming topics, include brief code examples when relevant
- For mathematics, provide formulas and explanations
- Use bullet points for lists to keep organized
- Be concise but comprehensive in your responses
- If you need to clarify something, do so while still providing a helpful answer

Current user question: ${message}`
              }
            ],
            role: 'user'
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 800,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    })

    console.log('Gemini response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API Error:', errorData)
      
      let userFriendlyMessage = 'Sorry, I encountered an error. Please try again.'
      
      if (response.status === 429) {
        userFriendlyMessage = "I'm currently experiencing high demand. Please wait a moment and try again."
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
    const aiResponse = data.candidates[0].content.parts[0].text
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
