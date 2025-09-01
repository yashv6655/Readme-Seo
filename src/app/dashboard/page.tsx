import { requireAuth } from '@/lib/auth/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { UserMenu } from '@/components/auth/user-menu'

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Welcome to your dashboard, {user.email}!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>README Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage your README generation projects here.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Update your profile and preferences.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}