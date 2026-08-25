import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { templateId: string } };

function replacePlaceholders(content: string, values: Record<string, string>): string {
  let result = content;
  for (const [key, val] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
  }
  return result;
}

// POST /api/contracts/from-template/:templateId
export async function POST(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const { userId, contractName, parties, variableValues } = body;
  // parties: [{name, email, company, role, order}]
  // variableValues: {PARTY_1_NAME: 'Rahul', ...}

  if (!userId || !contractName) {
    return NextResponse.json({ error: 'userId and contractName required' }, { status: 400 });
  }

  const template = await prisma.contractTemplate.findUnique({
    where: { id: params.templateId },
    include: { variables: true },
  });
  if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

  // Build the variable substitution map — auto-inject party info
  const varMap: Record<string, string> = { ...variableValues };
  const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  varMap['CONTRACT_DATE'] = varMap['CONTRACT_DATE'] || today;

  if (parties && Array.isArray(parties)) {
    parties.forEach((p: any, idx: number) => {
      const n = idx + 1;
      varMap[`PARTY_${n}_NAME`] = varMap[`PARTY_${n}_NAME`] || p.name || '';
      varMap[`PARTY_${n}_EMAIL`] = varMap[`PARTY_${n}_EMAIL`] || p.email || '';
      varMap[`PARTY_${n}_COMPANY`] = varMap[`PARTY_${n}_COMPANY`] || p.company || '';
      varMap[`PARTY_${n}_ROLE`] = varMap[`PARTY_${n}_ROLE`] || p.role || '';
    });
  }

  // Resolve content — replace all template variables
  const resolvedContent = replacePlaceholders(template.content, varMap);

  // Create the new contract — completely independent copy
  const contract = await prisma.contract.create({
    data: {
      userId,
      templateId: template.id,
      sourceType: 'FROM_TEMPLATE',
      title: contractName,
      type: template.type,
      content: resolvedContent,
      status: 'DRAFT',
      // Create initial version v1
      versions: {
        create: {
          versionNumber: 1,
          title: 'v1 — Original (from template)',
          content: resolvedContent,
          changedBy: 'System',
          changeDescription: `Generated from template: ${template.name}`,
        },
      },
      // Create parties
      parties: parties?.length
        ? {
            create: parties.map((p: any, idx: number) => ({
              name: p.name || '',
              email: p.email || '',
              company: p.company || '',
              role: p.role || `Party ${idx + 1}`,
              order: idx + 1,
            })),
          }
        : undefined,
      // Owner permission
      permissions: {
        create: {
          userId,
          role: 'OWNER',
        },
      },
      // Activity log
      activities: {
        create: {
          userId,
          type: 'CONTRACT_CREATED',
          description: `Contract "${contractName}" created from template "${template.name}"`,
        },
      },
    },
    include: {
      parties: true,
      permissions: true,
      versions: true,
    },
  });

  return NextResponse.json({ contract }, { status: 201 });
}
