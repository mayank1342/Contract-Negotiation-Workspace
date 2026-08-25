import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/db/prisma';

export const runtime = 'nodejs';

async function extractTextFromBuffer(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  const ext = filename.toLowerCase().split('.').pop();

  if (ext === 'txt') {
    return buffer.toString('utf-8');
  }

  if (ext === 'docx') {
    try {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch {
      return '[DOCX text extraction failed. Please paste content manually.]';
    }
  }

  if (ext === 'pdf') {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
      const pdfDoc = await loadingTask.promise;
      let fullText = '';
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      return fullText.trim() || '[PDF contained no extractable text. Please paste content manually.]';
    } catch {
      return '[PDF text extraction fallback: File uploaded. Please verify or paste content if text was scanned image.]';
    }
  }


  return '[Unsupported file type. Please paste content manually.]';
}

// POST /api/templates/upload
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const userId = formData.get('userId') as string | null;

  if (!file || !userId) {
    return NextResponse.json({ error: 'file and userId required' }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  const allowedExts = ['pdf', 'docx', 'txt'];
  const ext = file.name.toLowerCase().split('.').pop() || '';

  if (!allowedExts.includes(ext)) {
    return NextResponse.json({ error: 'Only PDF, DOCX, TXT files are allowed' }, { status: 400 });
  }

  // Validate file size (25MB max)
  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Max 25MB.' }, { status: 400 });
  }

  // Save file to /public/uploads/templates/
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), 'public', 'uploads', 'templates');
  await mkdir(uploadDir, { recursive: true });

  const uniqueName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const filePath = join(uploadDir, uniqueName);
  await writeFile(filePath, buffer);
  const fileUrl = `/uploads/templates/${uniqueName}`;

  // Extract text
  const extractedText = await extractTextFromBuffer(buffer, file.type, file.name);

  // Detect template variables in extracted text
  const varMatches = Array.from(new Set(Array.from(extractedText.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)).map((m: any) => m[1])));


  return NextResponse.json({
    fileUrl,
    fileType: ext,
    originalName: file.name,
    extractedText,
    detectedVariables: varMatches,
  });
}
