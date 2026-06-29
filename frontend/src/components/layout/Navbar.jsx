import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import ToolIcon from '../icons/ToolIcons'

const defaultLinks = [
  { label: 'Home', to: ROUTES.HOME, end: true },
  { label: 'Tools', to: `${ROUTES.HOME}#tools` },
  { label: 'About', to: `${ROUTES.HOME}#about` },
  { label: 'Contact', to: `${ROUTES.HOME}#contact` },
]

function Logo() {
  return (
    <Link
      to={ROUTES.HOME}
      className="group flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/50 transition-transform duration-300 group-hover:scale-105">
        <ToolIcon name="document" className="h-5 w-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-zinc-50">
        Document<span className="text-violet-400">Tools</span>
      </span>
    </Link>
  )
}

function NavbarLink({
  to,
  label,
  onClick,
  end,
  className = '',
  activeSection,
}) {
  const isHashLink = to.includes('#')

  if (isHashLink) {
    const sectionId = to.split('#')[1]

    return (
      <Link
        to={to}
        onClick={onClick}
        className={[
          'text-sm font-medium transition-colors duration-200',
          activeSection === sectionId
            ? 'text-violet-400'
            : 'text-zinc-400 hover:text-zinc-100',
          className,
        ].join(' ')}
      >
        {label}
      </Link>
    )
  }

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'text-sm font-medium transition-colors duration-200',
          isActive && activeSection === 'home'
            ? 'text-violet-400'
            : 'text-zinc-400 hover:text-zinc-100',
          className,
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

function MenuIcon({ open }) {
  return (
    <svg
      className="h-6 w-6 text-zinc-200"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      )}
    </svg>
  )
}

export default function Navbar({
  links = defaultLinks,
  className = '',
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') closeMenu()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen])

  useEffect(() => {
    const sections = ['tools', 'about', 'contact']

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        threshold: 0.4,
      }
    )

    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={[
        'sticky top-0 z-50 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl',
        className,
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <NavbarLink
              key={link.to}
              to={link.to}
              label={link.label}
              end={link.end}
              activeSection={activeSection}
            />
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={[
          'overflow-hidden border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl transition-all duration-300 ease-out md:hidden',
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-t-transparent',
        ].join(' ')}
        aria-hidden={!menuOpen}
      >
        <nav
          className="flex flex-col gap-1 px-4 py-4 sm:px-6"
          aria-label="Mobile navigation"
        >
          {links.map((link) => (
            <NavbarLink
              key={link.to}
              to={link.to}
              label={link.label}
              end={link.end}
              onClick={closeMenu}
              activeSection={activeSection}
              className="rounded-lg px-3 py-3 hover:bg-white/5"
            />
          ))}
        </nav>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 top-16 z-[-1] bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}
    </header>
  )
}
