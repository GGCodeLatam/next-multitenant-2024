// app/api/create-tenant/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, subdomain } = await request.json()

    if (!name || !subdomain) {
      return NextResponse.json({ error: 'Name and subdomain are required' }, { status: 400 })
    }

    const existingTenant = await prisma.tenant.findUnique({
      where: { subdomain },
    })

    if (existingTenant) {
      return NextResponse.json({ error: 'Subdomain already exists' }, { status: 409 })
    }

    const newTenant = await prisma.tenant.create({
      data: { name, subdomain },
    })

    return NextResponse.json(newTenant, { status: 201 })
  } catch (error) {
    console.error('Error creating tenant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}