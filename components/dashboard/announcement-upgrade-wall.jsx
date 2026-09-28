import Link from 'next/link'
import { Check, ChevronRight, Lock, Megaphone } from 'lucide-react'

import { Button } from '@/components/ui/button'

const features = [
  'Modal and banner announcements',
  'Slide-in cards on Pro',
  'Audience and URL targeting',
  'View, click, and CTR tracking',
]

export function AnnouncementUpgradeWall({ currentPlan = 'free' }) {
  const planLabel = currentPlan === 'starter' ? 'Starter' : currentPlan === 'free' ? 'Free' : 'your current'

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center">
      <div className="w-full rounded-xl border border-white/10 bg-[#111111]/90 p-6 shadow-[0_0_0_1px_color-mix(in_srgb,#F15025_12%,transparent),0_24px_48px_-24px_rgba(0,0,0,0.6)] backdrop-blur-sm md:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-[#F15025]/30 bg-[#F15025]/10">
            <Megaphone className="size-7 text-[#F15025]" aria-hidden />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#F15025]">
            STARTER + PRO ✦ ANNOUNCEMENTS
          </p>
          <h1 className="text-balance text-2xl font-bold tracking-tight text-white md:text-3xl">Announcements</h1>
          <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-[#999999] md:text-base">
            Announcements require Starter or Pro. Ship product updates as a modal — same script tag as your tour.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0a0a0a] px-3 py-1 text-xs text-[#888888]">
            <Lock className="size-3 shrink-0 text-[#F15025]" aria-hidden />
            You&apos;re on {planLabel} plan
          </span>
        </div>

        <ul className="mb-8 flex flex-col gap-2.5 border-t border-white/[0.06] pt-6">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-[#888888]">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#22c55e]/15">
                <Check className="size-3 text-[#22c55e]" aria-hidden />
              </span>
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          <Button size="lg" asChild className="h-12 w-full bg-[#F15025] text-base font-semibold hover:bg-[#F15025]/90">
            <Link href="/pricing">
              View pricing
              <ChevronRight className="ml-1 size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
