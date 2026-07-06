import { redirect } from 'next/navigation'

export const metadata = {
  title: 'AI Tour Generator',
  description: 'Generate product tour steps automatically using AI. Pro feature included in TourKit.',
}

export default function Page() {
  redirect('/dashboard')
}
