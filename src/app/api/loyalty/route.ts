import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Check loyalty points by phone number
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json({ error: 'Nomor telepon diperlukan' }, { status: 400 })
    }

    // Find loyalty member by phone
    const member = await db.loyaltyMember.findUnique({
      where: { phone },
      select: {
        name: true,
        phone: true,
        points: true,
        level: true,
        totalSpent: true,
      },
    })

    if (!member) {
      return NextResponse.json({ error: 'Member tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error('Error fetching loyalty info:', error)
    return NextResponse.json({ error: 'Gagal mengambil data loyalitas' }, { status: 500 })
  }
}

// POST - Create or update loyalty member (for registration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Nama dan nomor telepon diperlukan' }, { status: 400 })
    }

    // Check if member already exists
    const existingMember = await db.loyaltyMember.findUnique({
      where: { phone },
    })

    if (existingMember) {
      // Update existing member
      const updatedMember = await db.loyaltyMember.update({
        where: { phone },
        data: {
          name,
          email: email || existingMember.email,
        },
      })
      return NextResponse.json({ member: updatedMember, isNew: false })
    }

    // Create new member
    const newMember = await db.loyaltyMember.create({
      data: {
        name,
        phone,
        email,
        points: 0,
        totalSpent: 0,
        level: 'bronze',
      },
    })

    return NextResponse.json({ member: newMember, isNew: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating/updating loyalty member:', error)
    return NextResponse.json({ error: 'Gagal membuat/update member' }, { status: 500 })
  }
}
