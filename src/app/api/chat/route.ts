import { NextRequest, NextResponse } from 'next/server';
import { chatWithPGGenie, type ChatMessage } from '@/lib/gemini';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';

/**
 * POST /api/chat
 * Streaming chat endpoint for the PG Genie AI assistant.
 * 
 * Body: { messages: [{ role: 'user' | 'model', content: string }] }
 * Returns: Streamed text/event-stream response
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Please provide messages array' },
        { status: 400 }
      );
    }

    // Get the latest user message to check if we need property context
    const latestUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    let propertyContext: string | undefined;

    if (latestUserMsg) {
      const query = latestUserMsg.content.toLowerCase();
      const needsContext =
        query.includes('pg') ||
        query.includes('find') ||
        query.includes('search') ||
        query.includes('show') ||
        query.includes('price') ||
        query.includes('amenity') ||
        query.includes('amenities') ||
        query.includes('room') ||
        query.includes('cheap') ||
        query.includes('budget') ||
        query.includes('near') ||
        query.includes('compare') ||
        query.includes('list') ||
        query.includes('available') ||
        query.includes('recommend');

      if (needsContext) {
        try {
          await connectToDatabase();
          const properties = await Property.find({ status: 'active' })
            .select('title price location amenities roomTypes gender wifi furniture attachedBath meals ac geyser cctv backupPower')
            .limit(15)
            .lean();

          if (properties.length > 0) {
            propertyContext = properties
              .map((p: any) => {
                const amenities = [
                  ...(p.amenities || []),
                  p.wifi && 'WiFi',
                  p.furniture && 'Furniture',
                  p.attachedBath && 'Attached Bath',
                  p.meals && 'Meals',
                  p.ac && 'AC',
                  p.geyser && 'Geyser',
                  p.cctv && 'CCTV',
                  p.backupPower && 'Backup Power',
                ].filter(Boolean);

                return `- **${p.title}**: ₹${p.price}/mo, ${p.location?.city || 'Kothri'}, ${p.gender || 'Co-ed'}, Rooms: ${(p.roomTypes || []).join(', ')}, Amenities: ${amenities.join(', ')}`;
              })
              .join('\n');
          }
        } catch (dbError) {
          console.error('[chat] DB context fetch error:', dbError);
          // Continue without property context
        }
      }
    }

    // Stream the response from Gemini
    const stream = await chatWithPGGenie(messages, propertyContext);

    // Convert the async generator to a ReadableStream for SSE
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
              // Send as SSE data event
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          // Signal completion
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (error) {
          console.error('[chat] Streaming error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'An error occurred while generating the response.' })}\n\n`
            )
          );
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('[chat] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
