import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useTheme } from "./useTheme"

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
    themes: ["light", "dark"],
    systemTheme: "light",
  }),
}))

describe("useTheme Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns theme state", () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current).toHaveProperty("theme")
    expect(result.current).toHaveProperty("setTheme")
    expect(result.current).toHaveProperty("toggleTheme")
    expect(result.current).toHaveProperty("mounted")
  })

  it("provides setTheme function", () => {
    const { result } = renderHook(() => useTheme())
    expect(typeof result.current.setTheme).toBe("function")
  })

  it("provides toggleTheme function", () => {
    const { result } = renderHook(() => useTheme())
    expect(typeof result.current.toggleTheme).toBe("function")
  })

  it("mounted state is available", () => {
    const { result } = renderHook(() => useTheme())
    expect(typeof result.current.mounted).toBe("boolean")
  })
})
