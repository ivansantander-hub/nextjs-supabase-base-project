'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  children: React.ReactNode
  variant?: 'underline' | 'pills' | 'boxed'
  orientation?: 'horizontal' | 'vertical'
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({
    tabs,
    activeTab,
    onTabChange,
    children,
    variant = 'underline',
    orientation = 'horizontal',
  }, ref) => {
    const [active, setActive] = React.useState(activeTab || tabs[0]?.id)

    React.useEffect(() => {
      if (activeTab) setActive(activeTab)
    }, [activeTab])

    const handleTabClick = (tabId: string) => {
      const tab = tabs.find(t => t.id === tabId)
      if (!tab?.disabled) {
        setActive(tabId)
        onTabChange?.(tabId)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
      const currentIndex = tabs.findIndex(t => t.id === tabId)
      let nextIndex = currentIndex

      if (orientation === 'horizontal') {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          nextIndex = (currentIndex + 1) % tabs.length
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
        }
      } else {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          nextIndex = (currentIndex + 1) % tabs.length
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
        }
      }

      if (nextIndex !== currentIndex) {
        const nextTab = tabs[nextIndex]
        if (!nextTab?.disabled) {
          handleTabClick(nextTab.id)
        }
      }
    }

    const tabListClasses = cn(
      'flex gap-1',
      orientation === 'vertical' && 'flex-col',
      'border-b border-slate-200 dark:border-slate-700',
      variant === 'pills' && 'bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border-0'
    )

    const tabButtonClasses = (isActive: boolean, isDisabled: boolean) =>
      cn(
        'px-4 py-2 font-medium text-sm',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'dark:focus:ring-offset-slate-900',
        isDisabled && 'opacity-50 cursor-not-allowed',
        !isDisabled && 'cursor-pointer',
        variant === 'underline' && cn(
          isActive
            ? cn(
              'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
            )
            : cn(
              'text-slate-600 dark:text-slate-400 border-b-2 border-transparent hover:text-slate-900 dark:hover:text-slate-50'
            )
        ),
        variant === 'pills' && cn(
          isActive
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50'
        ),
        variant === 'boxed' && cn(
          isActive
            ? 'bg-blue-600 dark:bg-blue-500 text-white border border-blue-600 dark:border-blue-500'
            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-700 hover:border-blue-500'
        )
      )

    return (
      <div ref={ref} className="w-full">
        <div
          role="tablist"
          aria-orientation={orientation}
          className={tabListClasses}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={active === tab.id}
              aria-controls={`panel-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              className={tabButtonClasses(active === tab.id, !!tab.disabled)}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && (child.props as any).tabId === active) {
              return (
                <div
                  role="tabpanel"
                  id={`panel-${active}`}
                  aria-labelledby={`tab-${active}`}
                  className="animate-in fade-in duration-200"
                >
                  {child}
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    )
  }
)

Tabs.displayName = 'Tabs'

// TabPanel component for use with Tabs
interface TabPanelProps {
  tabId: string
  children: React.ReactNode
}

const TabPanel = ({ children }: TabPanelProps) => (
  <>{children}</>
)

TabPanel.displayName = 'TabPanel'

export { Tabs, TabPanel }
