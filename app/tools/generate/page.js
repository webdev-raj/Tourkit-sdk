import { redirect } from 'next/navigation'

import { getUserPlan } from '@/app/actions/billing'
import { GeneratorUpgradeWall } from '@/components/tools/generator-upgrade-wall'
import { TourGenerator } from '@/components/tools/tour-generator'
import { createClient } from '@/lib/supabase/server'

export default async function GenerateTourPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth?mode=signup')
  }

  const { plan } = await getUserPlan()
  const isPro = plan === 'pro'

  if (!isPro) {
    return <GeneratorUpgradeWall currentPlan={plan} />
  }

  return <TourGenerator />
}
