import { NextResponse } from 'next/server';
import { prismaMaterialRepository } from '@/entities/material/api/prisma-material.repository';

export async function GET() {
  try {
    const materials = await prismaMaterialRepository.getAll();
    return NextResponse.json(materials);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch materials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prismaMaterialRepository.save(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create material' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const updated = await prismaMaterialRepository.update(id, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update material' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing material id' }, { status: 400 });

    await prismaMaterialRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete material' }, { status: 500 });
  }
}
