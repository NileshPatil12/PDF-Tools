export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="about" className="border-t border-white/5 bg-zinc-950/50 scroll-mt-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <p className="text-sm text-zinc-500">
          © {year} DocumentTools. Free, fast, and private Document utilities.
        </p>
        <div className="flex gap-6 text-sm text-zinc-500">
          <a href="#" className="transition-colors hover:text-zinc-300">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-zinc-300">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-zinc-300">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
