'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Coffee, ArrowLeft, Star, Gift, Phone, User, 
  Loader2, Search, Award, TrendingUp, Calendar
} from 'lucide-react'
import Link from 'next/link'

interface LoyaltyMember {
  id: string
  name: string
  phone: string
  email: string | null
  points: number
  level: string
  totalSpent: number
  createdAt: string
}

interface RecentOrder {
  orderNumber: string
  total: number
  status: string
  loyaltyPointsEarned: number | null
  createdAt: string
}

interface CafeSettings {
  whatsappNumber: string
  cafeName: string
  cafeLogo: string
}

const DEFAULT_SETTINGS: CafeSettings = {
  whatsappNumber: '6282148615641',
  cafeName: 'Star Village Coffee',
  cafeLogo: '/images/logo.png',
}

const formatPrice = (price: number) => `Rp ${(price * 1000).toLocaleString('id-ID')}`

// Level badge colors
const levelColors: Record<string, string> = {
  bronze: 'bg-amber-700 text-white',
  silver: 'bg-gray-400 text-white',
  gold: 'bg-yellow-500 text-white',
  platinum: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
}

const levelNames: Record<string, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
}

const levelIcons: Record<string, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
}

export default function LoyaltyPage() {
  const [settings, setSettings] = useState<CafeSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [phone, setPhone] = useState('')
  const [member, setMember] = useState<LoyaltyMember | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          if (data.settings) {
            setSettings({
              whatsappNumber: data.settings.cafe_phone?.value || DEFAULT_SETTINGS.whatsappNumber,
              cafeName: data.settings.cafe_name?.value || DEFAULT_SETTINGS.cafeName,
              cafeLogo: data.settings.cafe_logo?.value || DEFAULT_SETTINGS.cafeLogo,
            })
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const searchMember = async () => {
    if (!phone.trim()) {
      setError('Masukkan nomor telepon')
      return
    }

    setSearching(true)
    setError('')
    setMember(null)
    setRecentOrders([])

    try {
      const res = await fetch(`/api/loyalty?phone=${phone}`)
      const data = await res.json()

      if (res.ok) {
        setMember(data.member)
        setRecentOrders(data.recentOrders || [])
      } else {
        setError(data.error || 'Member tidak ditemukan')
      }
    } catch (error) {
      console.error('Error searching member:', error)
      setError('Gagal mencari data member')
    } finally {
      setSearching(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-amber-600 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Kembali</span>
            </Link>
            <div className="w-px h-6 bg-border" />
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow flex items-center justify-center">
                {settings.cafeLogo ? (
                  <img src={settings.cafeLogo} alt="Logo" className="w-9 h-9 object-contain" />
                ) : (
                  <Coffee className="w-5 h-5 text-amber-700" />
                )}
              </div>
              <span className="font-bold text-lg hidden sm:block">{settings.cafeName}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Loyalty Points</h1>
            <p className="text-muted-foreground">Cek poin loyalitas Anda</p>
          </div>

          {/* Search Card */}
          <Card className="border-0 shadow-xl mb-6">
            <CardContent className="p-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nomor telepon (08xxx)"
                    className="pl-10 py-6"
                    onKeyDown={(e) => e.key === 'Enter' && searchMember()}
                  />
                </div>
                <Button 
                  onClick={searchMember}
                  disabled={searching}
                  className="bg-amber-600 hover:bg-amber-700 px-6"
                >
                  {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Member Info */}
          {member && (
            <Card className="border-0 shadow-xl overflow-hidden">
              {/* Member Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{member.name}</h2>
                    <p className="text-white/80">{member.phone}</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Level Badge */}
                <div className="flex items-center justify-between mb-6 p-4 bg-secondary/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{levelIcons[member.level] || '⭐'}</span>
                    <div>
                      <p className="text-sm text-muted-foreground">Level Member</p>
                      <Badge className={`${levelColors[member.level] || 'bg-gray-500 text-white'} text-sm px-3 py-1`}>
                        {levelNames[member.level] || member.level}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-amber-600" />
                      <span className="text-sm text-muted-foreground">Poin</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-700">{member.points.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-muted-foreground">Total Belanja</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">{formatPrice(member.totalSpent)}</p>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Calendar className="w-4 h-4" />
                  <span>Member sejak {new Date(member.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>

                {/* Recent Orders */}
                {recentOrders.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      Pesanan Terakhir
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {recentOrders.map((order, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">{formatPrice(order.total)}</p>
                            {order.loyaltyPointsEarned && order.loyaltyPointsEarned > 0 && (
                              <p className="text-xs text-green-600">+{order.loyaltyPointsEarned} poin</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-2">Keuntungan Member</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Dapatkan poin setiap transaksi</li>
                    <li>• Tukar poin dengan gratis menu</li>
                    <li>• Promo eksklusif member</li>
                    <li>• Level naik, benefit makin banyak!</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Member Yet */}
          {!member && !searching && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Gift className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold mb-2">Belum ada data</h3>
                <p className="text-sm text-muted-foreground">
                  Masukkan nomor telepon untuk melihat poin loyalitas Anda
                </p>
              </CardContent>
            </Card>
          )}

          {/* Register CTA */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Belum jadi member?</p>
            <Link href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Halo, saya ingin daftar member loyalty!')}`}>
              <Button variant="outline" className="gap-2">
                <Phone className="w-4 h-4" />
                Daftar via WhatsApp
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
