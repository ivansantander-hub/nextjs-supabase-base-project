import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook } from "@testing-library/react"
import { useI18n } from "./useI18n"

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/es/dashboard",
}))

describe("useI18n Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns translation function and changeLanguage", () => {
    const { result } = renderHook(() => useI18n())

    expect(result.current).toHaveProperty("t")
    expect(result.current).toHaveProperty("changeLanguage")
  })

  it("t function is callable", () => {
    const { result } = renderHook(() => useI18n())
    expect(typeof result.current.t).toBe("function")
  })

  it("changeLanguage function is callable", () => {
    const { result } = renderHook(() => useI18n())
    expect(typeof result.current.changeLanguage).toBe("function")
  })

  it("t function returns translation keys", () => {
    const { result } = renderHook(() => useI18n())
    const translatedKey = result.current.t("common.hello")
    expect(translatedKey).toBe("common.hello")
  })
})
