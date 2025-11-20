import { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-56px)] flex">
      <div className="mx-auto max-w-[1920px] w-full flex">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <div className="px-4 py-6 flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

