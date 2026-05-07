import type { ReactNode } from 'react'

interface StatisticsCardProps {
  icon: ReactNode
  title: string
  value: string | number
  children?: ReactNode
}

function StatisticsCard({ icon, title, value, children }: StatisticsCardProps) {
  return (
    <div className="border-gray/20 dark:border-gray-dark/30 flex flex-col items-center rounded-xl border p-6 shadow-md transition-transform duration-300 hover:scale-103">
      <div className="bg-accent mb-4 flex h-16 w-16 items-center justify-center rounded-full">{icon}</div>
      <h2 className="mb-2 text-lg font-semibold lg:text-xl">{title}</h2>
      <p className="mb-4 text-3xl font-bold lg:text-4xl">{value}</p>
      {children}
    </div>
  )
}

export default StatisticsCard
