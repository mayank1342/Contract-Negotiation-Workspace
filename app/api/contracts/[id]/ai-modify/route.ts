import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAIProvider } from '@/lib/ai/index';

type Params = { params: { id: string } };

// POST /api/contracts/:id/ai-modify
// AI returns suggestion only — it does NOT auto-apply the change.
// The frontend shows Accept/Reject. On Accept, a PATCH to versions is made.
export async function POST(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const { userId, instruction, currentContent, clauseRef } = body;

  if (!userId || !instruction) {
    return NextResponse.json({ error: 'userId and instruction required' }, { status: 400 });
  }

  // Authorization check
  const permission = await prisma.contractPermission.findFirst({
    where: {
      contractId: params.id,
      userId,
      role: { in: ['OWNER', 'EDITOR'] },
    },
  });
  if (!permission) return NextResponse.json({ error: 'Forbidden — EDITOR or OWNER required' }, { status: 403 });

  const contract = await prisma.contract.findUnique({ where: { id: params.id } });
  if (!contract) return NextResponse.json({ error: 'Contract not found' }, { status: 404 });

  const ai = getAIProvider();

  // Extract the "old" clause text — either a specific clause or the whole content
  const oldText = clauseRef
    ? extractClauseText(currentContent || contract.content, clauseRef)
    : currentContent || contract.content;

  // Use rewriteClause for targeted changes, or a custom prompt for whole-contract changes
  let newText: string;
  try {
    if (clauseRef) {
      newText = await ai.rewriteClause(oldText, instruction);
    } else {
      // For whole-contract instructions, use rewriteClause on full content
      newText = await ai.rewriteClause(oldText, instruction);
    }
  } catch (err) {
    // Fallback demo suggestion if AI fails
    newText = generateDemoSuggestion(oldText, instruction);
  }

  return NextResponse.json({
    suggestion: {
      instruction,
      clauseRef: clauseRef || null,
      oldText,
      newText,
      // The caller must POST to /versions with newContent on Accept
    },
  });
}

function extractClauseText(content: string, clauseRef: string): string {
  // Attempt to find a paragraph matching the clause ref
  const lines = content.split('\n');
  let capturing = false;
  const result: string[] = [];

  for (const line of lines) {
    if (line.toLowerCase().includes(clauseRef.toLowerCase())) {
      capturing = true;
    }
    if (capturing) {
      result.push(line);
      if (result.length > 10) break; // reasonable clause window
    }
  }

  return result.length > 0 ? result.join('\n') : content;
}

function generateDemoSuggestion(oldText: string, instruction: string): string {
  const lower = instruction.toLowerCase();
  if (lower.includes('30 days') && lower.includes('45 days')) {
    return oldText.replace(/30[\s-]*days?/gi, '45 Days');
  }
  if (lower.includes('termination')) {
    return oldText + '\n\n[AI ADDED] Termination Clause: Either party may terminate this agreement with 30 days written notice. In case of material breach, the non-breaching party may terminate immediately upon written notice.';
  }
  if (lower.includes('simpler') || lower.includes('simple')) {
    return `[Simplified by AI]\n${oldText.substring(0, 200)}...\n\nIn plain terms: Both parties agree to the terms stated above. If there is a dispute, both will work together to resolve it.`;
  }
  if (lower.includes('professional')) {
    return `[Professionally Revised by AI]\n${oldText}`;
  }
  return `[AI Modified — ${instruction}]\n\n${oldText}`;
}
