import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Icon } from "./Icon"

describe("Icon", () => {
  it("renders icon wrapper", () => {
    render(<Icon><span>🎉</span></Icon>)
    expect(screen.getByText("🎉")).toBeInTheDocument()
  })

  it("applies size variants", () => {
    const { container: smContainer } = render(
      <Icon size="sm"><span>🎉</span></Icon>
    )
    expect(smContainer.firstChild).toHaveClass("h-4")

    const { container: lgContainer } = render(
      <Icon size="lg"><span>🎉</span></Icon>
    )
    expect(lgContainer.firstChild).toHaveClass("h-6")
  })

  it("applies color variants", () => {
    const { container } = render(
      <Icon color="destructive"><span>🎉</span></Icon>
    )
    expect(container.firstChild).toHaveClass("text-destructive")
  })

  it("applies stroke width variants", () => {
    const { container } = render(
      <Icon strokeWidth="bold"><span>🎉</span></Icon>
    )
    expect(container.firstChild).toHaveClass("[&_svg]:stroke-[2]")
  })

  it("defaults to md size and default color", () => {
    const { container } = render(
      <Icon><span>🎉</span></Icon>
    )
    expect(container.firstChild).toHaveClass("h-5", "w-5", "text-foreground")
  })
})
