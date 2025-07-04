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
          {
            parts: [
              {
                text: `You are PolyPros, a study assistant specifically for SBTET (State Board of Technical Education and Training) Andhra Pradesh polytechnic students. 

FOCUS AREAS: Only answer questions related to SBTET AP curriculum including:
- Engineering Mathematics (as per SBTET syllabus)
- Computer Science & Engineering subjects
- Electronics & Communication Engineering
- Mechanical Engineering
- Civil Engineering
- Electrical Engineering
- Other SBTET AP polytechnic subjects

IMPORTANT GUIDELINES:
- Keep responses SHORT and CONCISE by default (2-3 sentences)
- Only provide detailed explanations when user specifically asks for "detailed explanation", "explain in detail", "give more info", "examples", or similar requests
- When asked for "important questions" or "imp questions", provide 3-5 actual important questions for the subject mentioned, or if no subject is mentioned, provide questions for common subjects like C Programming, Engineering Mathematics, etc.
- For programming topics, include brief code examples when specifically requested
- For mathematics, provide brief formulas unless detailed solutions are requested
- Use bullet points for lists to keep organized
- Never ask user to select branch or specify subject when they ask for important questions - directly provide questions
- Reference SBTET AP syllabus patterns when relevant
- If question is not related to SBTET AP polytechnic studies, politely redirect to relevant topics

User question: ${message}`
              }
            ]
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
