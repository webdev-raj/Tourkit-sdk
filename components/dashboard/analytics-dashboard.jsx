"use client"

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ArrowDown,
  BarChart2,
  CheckCircle,
  Copy,
  Play,
  SkipForward,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const CDN_URL = 'https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit@main/sdk/dist/tourkit.min.js?v=2'

function StatCard({ icon: Icon, iconColor, iconBg, value, label, subText }) {
  return (
    <Card className="rounded-xl border border-white/10 bg-[#111111]">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex size-10 items-center justify-center rounded-full" style={{ backgroundColor: iconBg }}>
            <Icon className="size-5" style={{ color: iconColor }} />
          </div>
        </div>
        <div className="text-3xl font-bold text-white">{value}</div>
        <p className="mt-1 text-sm text-gray-400">{label}</p>
        {subText ? <p className="mt-1 text-xs text-gray-500">{subText}</p> : null}
      </CardContent>
    </Card>
  )
}

export function AnalyticsDashboard({ project, summary, stepData, overTime, isTourActive }) {
  const [copied, setCopied] = useState(false)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const installSnippet = `<script
  src="${CDN_URL}"
  data-key="${project.script_key}"
  data-api="${appUrl}"
  async>
</script>`

  const hasStarts = Number(summary?.total_starts || 0) > 0
  const hasTimelineData = Array.isArray(overTime) && overTime.some((row) => Number(row?.count || 0) > 0)
  const firstStepViews = Number(stepData?.[0]?.views || 0)

  const normalizedStepData = useMemo(() => {
    if (!Array.isArray(stepData)) return []
    return stepData.map((row, idx) => {
      const prevViews = idx > 0 ? Number(stepData[idx - 1]?.views || 0) : 0
      const currentViews = Number(row?.views || 0)
      const dropPercent =
        idx > 0 && prevViews > 0
          ? Math.max(0, Math.round(((prevViews - currentViews) / prevViews) * 100))
          : 0
      const widthPercent = firstStepViews > 0 ? Math.max(0, Math.min(100, (currentViews / firstStepViews) * 100)) : 0
      return {
        step_order: Number(row?.step_order || 0),
        views: currentViews,
        dropPercent,
        widthPercent,
      }
    })
  }, [stepData, firstStepViews])

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(installSnippet)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch (_) {
      /* silent */
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Link
            href={`/dashboard/projects/${project.id}`}
            className="text-sm text-muted-foreground transition-colors hover:text-primary">
            ← Back to project
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{project.name}</h1>
          <p className="text-sm text-muted-foreground">Tour analytics and performance</p>
        </div>
        <div className="rounded-full border border-white/10 bg-card px-3 py-1.5 text-xs font-medium text-gray-300">
          Tour {isTourActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {!hasStarts ? (
        <Card className="border border-white/10 bg-[#111111]">
          <CardContent className="flex flex-col items-center gap-5 px-6 py-14 text-center">
            <BarChart2 className="size-16 text-muted-foreground" />
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-white">No analytics data yet</h2>
              <p className="max-w-xl text-sm text-muted-foreground">
                Install the script tag on your website and start getting visitors to see data here.
              </p>
            </div>
            <pre className="w-full max-w-2xl overflow-auto rounded-lg border border-white/10 bg-[#0a0a0a] p-4 text-left text-xs text-[#e5e7eb]">
              <code className="whitespace-pre-wrap break-all">{installSnippet}</code>
            </pre>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/projects/${project.id}`}>← Back to project</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Users}
              iconColor="#F15025"
              iconBg="rgba(241,80,37,0.10)"
              value={summary.total_sessions}
              label="Unique sessions"
            />
            <StatCard
              icon={Play}
              iconColor="#3b82f6"
              iconBg="rgba(59,130,246,0.10)"
              value={summary.total_starts}
              label="Tours started"
            />
            <StatCard
              icon={CheckCircle}
              iconColor="#22c55e"
              iconBg="rgba(34,197,94,0.10)"
              value={summary.total_completions}
              label="Completions"
              subText={`${summary.completion_rate}% completion rate`}
            />
            <StatCard
              icon={SkipForward}
              iconColor="#eab308"
              iconBg="rgba(234,179,8,0.10)"
              value={summary.total_skips}
              label="Skipped"
              subText={`${summary.skip_rate}% skip rate`}
            />
          </section>

          <Card className="rounded-xl border border-white/10 bg-[#111111]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="size-5 text-primary" />
                Tours started over time
              </CardTitle>
              <p className="text-sm text-muted-foreground">Last 14 days</p>
            </CardHeader>
            <CardContent>
              {hasTimelineData ? (
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={overTime}>
                      <CartesianGrid stroke="#1a1a1a" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: '#666', fontSize: 12 }}
                        tickFormatter={(val) =>
                          new Date(val).toLocaleDateString('en', { month: 'short', day: 'numeric' })
                        }
                      />
                      <YAxis tick={{ fill: '#666', fontSize: 12 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          background: '#111',
                          border: '1px solid #222',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#F15025"
                        strokeWidth={2}
                        dot={{ fill: '#F15025', r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                  No tour starts recorded yet
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-white/10 bg-[#111111]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <ArrowDown className="size-5 text-primary" />
                Step by step dropoff
              </CardTitle>
              <p className="text-sm text-muted-foreground">How many visitors reach each step</p>
            </CardHeader>
            <CardContent>
              {normalizedStepData.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No step data recorded yet</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {normalizedStepData.map((step, idx) => (
                    <div key={step.step_order} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-3">
                        <span className="w-16 text-sm text-gray-400">Step {step.step_order}</span>
                        <div className="h-2 flex-1 rounded-full bg-[#1a1a1a]">
                          <div
                            className="h-2 rounded-full bg-[#F15025] transition-[width] duration-500 ease-in-out"
                            style={{ width: `${step.widthPercent}%` }}
                          />
                        </div>
                        <span className="w-16 text-right text-sm text-gray-400">{step.views} views</span>
                      </div>
                      {idx > 0 && step.dropPercent > 0 ? (
                        <div className="pl-[4.75rem] text-xs text-red-400">↓ {step.dropPercent}% drop</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <section className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-xl border border-white/10 bg-[#111111]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Install snippet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex justify-end">
                  <Button type="button" variant="outline" size="sm" onClick={copySnippet}>
                    <Copy className="mr-1.5 size-4" />
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <pre className="overflow-auto rounded-lg border border-white/10 bg-[#0a0a0a] p-4 text-xs text-[#e5e7eb]">
                  <code className="whitespace-pre-wrap break-all">{installSnippet}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-white/10 bg-[#111111]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Tour settings</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="rounded-full border border-white/10 bg-card px-3 py-1.5 text-xs font-medium text-gray-300">
                  Status: {isTourActive ? 'Active' : 'Inactive'}
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/projects/${project.id}`}>Edit tour steps →</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/projects/${project.id}`}>View project →</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}
