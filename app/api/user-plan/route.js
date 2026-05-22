import { NextResponse } from 'next/server'

import { getUserPlan } from '@/app/actions/billing'

export async function GET() {
  try {
    const { plan } = await getUserPlan()
    return NextResponse.json({ plan })
  } catch {
    return NextResponse.json({ plan: 'free' })
  }
}
