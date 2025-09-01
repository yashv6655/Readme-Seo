import { requireAuth } from '@/lib/auth/utils'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const user = await requireAuth()

  return <DashboardClient user={user} />
}