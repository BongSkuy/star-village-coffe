import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + (process.env.PASSWORD_SALT || 'star-village-2024')).digest('hex')
}

export async function GET() {
  try {
    // Check database passwords
    const passwordSetting = await db.cafeSetting.findUnique({
      where: { key: 'admin_password_hash' }
    })
    
    const legacyPasswordSetting = await db.cafeSetting.findUnique({
      where: { key: 'admin_password' }
    })

    // Check env variable - try different cases
    const envPassword = process.env.ADMIN_INITIAL_PASSWORD
    const allEnvKeys = Object.keys(process.env).filter(k => k.toLowerCase().includes('admin') || k.toLowerCase().includes('password'))

    return NextResponse.json({
      env: {
        ADMIN_INITIAL_PASSWORD: envPassword ? `SET (length: ${envPassword.length}, first 3 chars: ${envPassword.substring(0, 3)}***)` : 'NOT SET',
        allAdminPasswordEnvKeys: allEnvKeys
      },
      database: {
        admin_password_hash: passwordSetting ? {
          exists: true,
          valuePreview: passwordSetting.value.substring(0, 20) + '...'
        } : 'NOT SET',
        admin_password: legacyPasswordSetting ? {
          exists: true,
          value: legacyPasswordSetting.value
        } : 'NOT SET'
      },
      allSettingsKeys: (await db.cafeSetting.findMany()).map(s => s.key)
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    // Check database passwords
    const passwordSetting = await db.cafeSetting.findUnique({
      where: { key: 'admin_password_hash' }
    })
    
    const legacyPasswordSetting = await db.cafeSetting.findUnique({
      where: { key: 'admin_password' }
    })

    // Check env variable - try different cases
    const envPassword = process.env.ADMIN_INITIAL_PASSWORD
    const envPasswordLower = process.env.admin_initial_password
    const allEnvKeys = Object.keys(process.env).filter(k => k.toLowerCase().includes('admin') || k.toLowerCase().includes('password'))

    // Calculate what the hash should be for the input password
    const inputHash = hashPassword(password || '')

    // Check all possible matches
    const matchesEnv = envPassword && password === envPassword
    const matchesEnvLower = envPasswordLower && password === envPasswordLower
    const matchesDbHash = passwordSetting && inputHash === passwordSetting.value
    const matchesDbPlain = passwordSetting && password === passwordSetting.value
    const matchesLegacy = legacyPasswordSetting && password === legacyPasswordSetting.value

    return NextResponse.json({
      input: {
        password: password || 'NOT PROVIDED',
        hash: inputHash.substring(0, 20) + '...'
      },
      env: {
        ADMIN_INITIAL_PASSWORD: envPassword ? `${envPassword.substring(0, 3)}*** (length: ${envPassword.length})` : 'NOT SET',
        admin_initial_password: envPasswordLower ? `${envPasswordLower.substring(0, 3)}***` : 'NOT SET',
        matchesEnv: matchesEnv,
        matchesEnvLower: matchesEnvLower,
        allAdminPasswordEnvKeys: allEnvKeys
      },
      database: {
        admin_password_hash: passwordSetting ? {
          value: passwordSetting.value.substring(0, 20) + '...',
          matchesHash: matchesDbHash,
          matchesPlain: matchesDbPlain
        } : 'NOT SET',
        admin_password: legacyPasswordSetting ? {
          value: legacyPasswordSetting.value,
          matches: matchesLegacy
        } : 'NOT SET'
      },
      authResult: {
        wouldAuthenticate: matchesEnv || matchesEnvLower || matchesDbHash || matchesDbPlain || matchesLegacy
      },
      allSettingsKeys: (await db.cafeSetting.findMany()).map(s => s.key)
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
