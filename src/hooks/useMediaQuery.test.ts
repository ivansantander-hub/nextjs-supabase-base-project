import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook } from "@testing-library/react"
import { useMediaQuery, useResponsive } from "./useMediaQuery"

describe("useMediaQuery Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns boolean for media query match", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 640px)"))
    expect(typeof result.current).toBe("boolean")
  })

  it("handles media query string", () => {
    const { result } = renderHook(() =>
      useMediaQuery("(min-width: 1024px)")
    )
    expect(typeof result.current).toBe("boolean")
  })
})

describe("useResponsive Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns responsive breakpoint states", () => {
    const { result } = renderHook(() => useResponsive())

    expect(result.current).toHaveProperty("isMobile")
    expect(result.current).toHaveProperty("isTablet")
    expect(result.current).toHaveProperty("isDesktop")
    expect(result.current).toHaveProperty("sm")
    expect(result.current).toHaveProperty("md")
    expect(result.current).toHaveProperty("lg")
  })

  it("all breakpoints are booleans", () => {
    const { result } = renderHook(() => useResponsive())

    expect(typeof result.current.isMobile).toBe("boolean")
    expect(typeof result.current.isTablet).toBe("boolean")
    expect(typeof result.current.isDesktop).toBe("boolean")
    expect(typeof result.current.sm).toBe("boolean")
    expect(typeof result.current.md).toBe("boolean")
    expect(typeof result.current.lg).toBe("boolean")
  })
})
