import GlassCard from '../ui/GlassCard'
import SectionHeading from '../ui/SectionHeading'

const steps = [
  {
    step: '01',
    title: 'Upload',
    description: 'Drop one or more PDFs into the upload zone or pick them from your device.',
  },
  {
    step: '02',
    title: 'Choose a tool',
    description: 'Select merge, split, compress, or any other utility from the tools grid.',
  },
  {
    step: '03',
    title: 'Download',
    description: 'Process your file and download the result — no account, no hassle.',
  },
]

export default function 
HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Workflow"
          title="Three steps, zero friction"
          description="A simple flow designed for speed — from upload to finished PDF in moments."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((item, index) => (
            <GlassCard
              key={item.step}
              className="relative p-8 transition-transform duration-300 hover:-translate-y-1"
            >
              {index < steps.length - 1 && (
                <div
                  className="pointer-events-none absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-violet-500/50 to-transparent md:block lg:-right-4 lg:w-8"
                  aria-hidden="true"
                />
              )}
              <span className="text-4xl font-bold text-violet-500/30">{item.step}</span>
              <h3 className="mt-4 text-xl font-semibold text-zinc-100">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">{item.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
