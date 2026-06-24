import ToolCard from './ToolCard'

export default function ToolCards({
  tools = [],
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  className = '',
  onToolClick,
}) {
  if (!tools.length) return null

  return (
    <div className={['grid gap-6 md:gap-8', columns, className].filter(Boolean).join(' ')}>
      {tools.map((tool, index) => (
        <div
          key={tool.id}
          style={{
            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
          }}
        >
          <ToolCard
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            to={onToolClick ? undefined : tool.path}
            color={tool.color}
            onClick={onToolClick ? () => onToolClick(tool) : undefined}
          />
        </div>
      ))}
    </div>
  )
}
