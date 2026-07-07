import { createClient } from '@/lib/supabase/server'
import InsightsPageClient from '@/components/insights/InsightsPageClient'
import type { Article } from '@/lib/types'

export const revalidate = 0

export default async function InsightsPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return <InsightsPageClient articles={(data ?? []) as Article[]} />
}
