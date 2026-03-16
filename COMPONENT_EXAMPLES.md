# Ejemplos de Implementación - Componentes

## 1. Componentes Atoms

### Button.tsx

```typescript
import { memo, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
}

const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        variant = 'primary',
        size = 'md',
        isLoading = false,
        fullWidth = false,
        className,
        disabled,
        children,
        ...props
      },
      ref
    ) => {
      const baseStyles = 'font-semibold rounded-lg transition-colors'

      const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
        secondary:
          'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400',
        ghost: 'bg-transparent hover:bg-gray-100 disabled:text-gray-400'
      }

      const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
      }

      return (
        <button
          ref={ref}
          disabled={disabled || isLoading}
          className={cn(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            fullWidth && 'w-full',
            className
          )}
          {...props}
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner size="sm" />
              {children}
            </span>
          ) : (
            children
          )}
        </button>
      )
    }
  )
)

Button.displayName = 'Button'

export default Button
```

### Input.tsx

```typescript
import { memo, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    (
      {
        label,
        error,
        helperText,
        leftIcon,
        rightIcon,
        className,
        disabled,
        ...props
      },
      ref
    ) => {
      return (
        <div className="w-full">
          {label && (
            <label
              htmlFor={props.id}
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          <div className="relative">
            {leftIcon && (
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {leftIcon}
              </span>
            )}

            <input
              ref={ref}
              disabled={disabled}
              className={cn(
                'w-full px-3 py-2 border rounded-lg transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                className
              )}
              aria-invalid={!!error}
              aria-describedby={error ? `${props.id}-error` : undefined}
              {...props}
            />

            {rightIcon && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {rightIcon}
              </span>
            )}
          </div>

          {error && (
            <p
              id={`${props.id}-error`}
              role="alert"
              className="mt-1 text-sm text-red-500"
            >
              {error}
            </p>
          )}

          {helperText && !error && (
            <p className="mt-1 text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )
    }
  )
)

Input.displayName = 'Input'

export default Input
```

### Badge.tsx

```typescript
import { memo } from 'react'
import { cn } from '@/utils/cn'

interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
  children: React.ReactNode
  className?: string
}

const Badge = memo(
  ({
    variant = 'default',
    size = 'sm',
    children,
    className
  }: BadgeProps) => {
    const variantStyles = {
      default: 'bg-gray-200 text-gray-800',
      primary: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800'
    }

    const sizeStyles = {
      sm: 'px-2 py-1 text-xs font-medium rounded',
      md: 'px-3 py-1.5 text-sm font-medium rounded-md'
    }

    return (
      <span
        className={cn(
          'inline-flex items-center',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
```

---

## 2. Componentes Molecules

### SearchInput.tsx

```typescript
import { memo, useState, useCallback } from 'react'
import Input from '@/components/atoms/Input'
import Icon from '@/components/atoms/Icon'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchInputProps {
  placeholder?: string
  onSearch: (query: string) => void
  debounceDelay?: number
}

const SearchInput = memo(
  ({
    placeholder = 'Buscar...',
    onSearch,
    debounceDelay = 300
  }: SearchInputProps) => {
    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, debounceDelay)

    // Trigger search cuando debounce termina
    useEffect(() => {
      onSearch(debouncedQuery)
    }, [debouncedQuery, onSearch])

    const handleClear = useCallback(() => {
      setQuery('')
    }, [])

    return (
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        leftIcon={<Icon name="search" />}
        rightIcon={
          query && (
            <button
              onClick={handleClear}
              aria-label="Limpiar búsqueda"
              className="text-gray-400 hover:text-gray-600"
            >
              <Icon name="x" />
            </button>
          )
        }
      />
    )
  }
)

SearchInput.displayName = 'SearchInput'

export default SearchInput
```

### StatusBadge.tsx

```typescript
import { memo } from 'react'
import Badge from '@/components/atoms/Badge'
import type { TaskStatus } from '@/types'

interface StatusBadgeProps {
  status: TaskStatus
}

const statusConfig = {
  todo: { variant: 'default' as const, label: 'Por hacer' },
  in_progress: { variant: 'primary' as const, label: 'En progreso' },
  review: { variant: 'warning' as const, label: 'En revisión' },
  done: { variant: 'success' as const, label: 'Completada' },
  archived: { variant: 'default' as const, label: 'Archivada' }
}

const StatusBadge = memo(({ status }: StatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.todo

  return <Badge variant={config.variant}>{config.label}</Badge>
})

StatusBadge.displayName = 'StatusBadge'

export default StatusBadge
```

### TaskCard.tsx (Molecule)

```typescript
import { memo } from 'react'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Text from '@/components/atoms/Text'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import UserChip from './UserChip'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onSelect: (id: string) => void
  isSelected?: boolean
}

const TaskCard = memo(
  ({ task, onSelect, isSelected }: TaskCardProps) => {
    return (
      <Card
        className={`p-4 cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
        }`}
        onClick={() => onSelect(task.id)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter') onSelect(task.id)
        }}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <Text as="h3" weight="semibold" truncate className="flex-1">
              {task.title}
            </Text>
            <div className="flex gap-2 ml-2">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
          </div>

          {task.description && (
            <Text as="p" color="gray" size="sm" truncate>
              {task.description}
            </Text>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            {task.assignee ? (
              <UserChip user={task.assignee} />
            ) : (
              <Text size="xs" color="gray">
                Sin asignar
              </Text>
            )}

            {task.dueDate && (
              <Text size="xs" color="gray">
                {formatDate(task.dueDate)}
              </Text>
            )}
          </div>
        </div>
      </Card>
    )
  }
)

TaskCard.displayName = 'TaskCard'

export default TaskCard
```

---

## 3. Componentes Organisms

### TaskFilters.tsx

```typescript
import { memo, useCallback } from 'react'
import { useFilterStore } from '@/stores/filterStore'
import { useTaskStore } from '@/stores/taskStore'
import SearchInput from '@/components/molecules/SearchInput'
import Button from '@/components/atoms/Button'

interface FilterValues {
  priority: string[]
  status: string[]
  search: string
}

const TaskFilters = memo(() => {
  const { priority, status, setPriority, setStatus, reset } = useFilterStore()
  const { fetchTasks } = useTaskStore()

  const handlePriorityChange = useCallback(
    (newPriority: string[]) => {
      setPriority(newPriority)
      // Fetch con nuevos filtros
      fetchTasks({
        priority: newPriority as any,
        status
      })
    },
    [status, setPriority, fetchTasks]
  )

  const handleReset = useCallback(() => {
    reset()
    fetchTasks()
  }, [reset, fetchTasks])

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      <SearchInput
        onSearch={(query) => {
          fetchTasks({ search: query })
        }}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Prioridad</label>
          <div className="space-y-2">
            {['high', 'medium', 'low'].map((p) => (
              <label key={p} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={priority.includes(p)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handlePriorityChange([...priority, p])
                    } else {
                      handlePriorityChange(
                        priority.filter((x) => x !== p)
                      )
                    }
                  }}
                />
                <span className="text-sm">{p}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Estado</label>
          <div className="space-y-2">
            {['todo', 'in_progress', 'review', 'done'].map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={status.includes(s)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setStatus([...status, s])
                    } else {
                      setStatus(status.filter((x) => x !== s))
                    }
                  }}
                />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant="secondary"
        onClick={handleReset}
        fullWidth
      >
        Limpiar filtros
      </Button>
    </div>
  )
})

TaskFilters.displayName = 'TaskFilters'

export default TaskFilters
```

### TaskList.tsx

```typescript
import { memo, useEffect } from 'react'
import { useTaskStore } from '@/stores/taskStore'
import TaskCard from '@/components/molecules/TaskCard'
import Spinner from '@/components/atoms/Spinner'
import Text from '@/components/atoms/Text'
import Pagination from '@/components/molecules/Pagination'

const TaskList = memo(() => {
  const { tasks, selectedTask, isLoading, error, fetchTasks, selectTask } =
    useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <Text color="danger">Error: {error}</Text>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <Text size="lg" color="gray">
          No hay tareas
        </Text>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onSelect={selectTask}
            isSelected={selectedTask?.id === task.id}
          />
        ))}
      </div>

      <Pagination />
    </div>
  )
})

TaskList.displayName = 'TaskList'

export default TaskList
```

---

## 4. Stores (Zustand)

### taskStore.ts

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { taskService } from '@/services/taskService'
import type { Task, TaskFilter } from '@/types'

interface TaskState {
  // State
  tasks: Task[]
  selectedTask: Task | null
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    pageSize: number
    total: number
  }

  // Actions
  fetchTasks: (filters?: TaskFilter) => Promise<void>
  selectTask: (id: string) => void
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  createTask: (task: Omit<Task, 'id'>) => Promise<void>
  resetError: () => void
  resetStore: () => void
  setPagination: (page: number, pageSize: number) => void
}

const initialState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, pageSize: 10, total: 0 }
}

export const useTaskStore = create<TaskState>()(
  devtools(
    (set) => ({
      ...initialState,

      fetchTasks: async (filters?: TaskFilter) => {
        set({ isLoading: true, error: null })
        try {
          const response = await taskService.getTasks(filters)
          set({
            tasks: response.data,
            pagination: {
              page: response.page,
              pageSize: response.pageSize,
              total: response.total
            }
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error desconocido'
          })
        } finally {
          set({ isLoading: false })
        }
      },

      selectTask: (id: string) => {
        set((state) => ({
          selectedTask: state.tasks.find((t) => t.id === id) || null
        }))
      },

      updateTask: async (id: string, updates: Partial<Task>) => {
        set({ isLoading: true, error: null })
        try {
          const updated = await taskService.updateTask(id, updates)
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? updated : t
            ),
            selectedTask:
              state.selectedTask?.id === id ? updated : state.selectedTask
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error desconocido'
          })
        } finally {
          set({ isLoading: false })
        }
      },

      deleteTask: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          await taskService.deleteTask(id)
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
            selectedTask:
              state.selectedTask?.id === id ? null : state.selectedTask
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error desconocido'
          })
        } finally {
          set({ isLoading: false })
        }
      },

      createTask: async (task: Omit<Task, 'id'>) => {
        set({ isLoading: true, error: null })
        try {
          const newTask = await taskService.createTask(task)
          set((state) => ({
            tasks: [newTask, ...state.tasks]
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error desconocido'
          })
        } finally {
          set({ isLoading: false })
        }
      },

      resetError: () => {
        set({ error: null })
      },

      resetStore: () => {
        set(initialState)
      },

      setPagination: (page: number, pageSize: number) => {
        set((state) => ({
          pagination: { ...state.pagination, page, pageSize }
        }))
      }
    }),
    { name: 'TaskStore' }
  )
)
```

---

## 5. Custom Hooks

### useDebounce.ts

```typescript
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### useTasks.ts

```typescript
import { useCallback, useEffect } from 'react'
import { useTaskStore } from '@/stores/taskStore'
import type { TaskFilter } from '@/types'

export function useTasks(filters?: TaskFilter) {
  const { tasks, isLoading, error, fetchTasks } = useTaskStore()

  const reloadTasks = useCallback(() => {
    fetchTasks(filters)
  }, [filters, fetchTasks])

  useEffect(() => {
    reloadTasks()
  }, [reloadTasks])

  return {
    tasks,
    isLoading,
    error,
    reloadTasks
  }
}
```

---

## 6. Servicios

### taskService.ts

```typescript
import axios from 'axios'
import type { Task, TaskFilter } from '@/types'

const API = axios.create({
  baseURL: '/api'
})

export const taskService = {
  getTasks: async (filters?: TaskFilter) => {
    const { data } = await API.get('/tasks', { params: filters })
    return data
  },

  getTaskById: async (id: string) => {
    const { data } = await API.get(`/tasks/${id}`)
    return data
  },

  createTask: async (task: Omit<Task, 'id'>) => {
    const { data } = await API.post('/tasks', task)
    return data
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    const { data } = await API.patch(`/tasks/${id}`, updates)
    return data
  },

  deleteTask: async (id: string) => {
    await API.delete(`/tasks/${id}`)
  }
}
```

---

## 7. Tests

### Button.test.tsx

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/components/atoms/Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)

    await user.click(screen.getByText('Click'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByText('Click')).toBeDisabled()
  })

  it('has correct aria attributes', () => {
    render(<Button aria-label="Custom label">Button</Button>)
    expect(screen.getByLabelText('Custom label')).toBeInTheDocument()
  })

  it('shows spinner when loading', () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
```

