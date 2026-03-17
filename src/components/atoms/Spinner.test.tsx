import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { Spinner } from "./Spinner"

describe("Spinner", () => {
  it("renders spinner icon", () => {
    const { container } = render(<Spinner />)
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })

  it("has animate-spin class", () => {
    const { container } = render(<Spinner />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveClass("animate-spin")
  })

  it("applies size variants", () => {
    const { container: smallContainer } = render(<Spinner size="sm" />)
    expect(smallContainer.querySelector("svg")).toHaveClass("h-4")

    const { container: largeContainer } = render(<Spinner size="lg" />)
    expect(largeContainer.querySelector("svg")).toHaveClass("h-8")
  })

  it("applies color variants", () => {
    const { container } = render(<Spinner color="destructive" />)
    expect(container.querySelector("svg")).toHaveClass("text-destructive")
  })

  it("defaults to md size and primary color", () => {
    const { container } = render(<Spinner />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveClass("h-6", "w-6", "text-primary")
  })
})
