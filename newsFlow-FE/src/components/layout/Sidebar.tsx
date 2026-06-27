'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/feed', label: '추천 피드' },
  { href: '/highlight', label: '핵심 기사' },
  { href: '/bookmarks', label: '북마크' },
  { href: '/settings', label: '설정' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-48 shrink-0">
      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith(href)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
