import { pdfTools } from '../../data/tools'
import SectionHeading from '../ui/SectionHeading'
import ToolCards from '../ui/ToolCards'

export default function ToolsGrid() {
  return (
    <section id="tools" className="relative px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Complete Tool Suite"
          title="All Your PDF Tools in One Place"
          description="Powerful utilities designed to make PDF processing effortless. Merge, split, convert, and more — all running securely in your browser."
        />

        <div className="mt-12">
          <ToolCards tools={pdfTools} />
        </div>
      </div>
    </section>
  )
}
