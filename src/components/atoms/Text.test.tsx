import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Text } from "./Text"

describe("Text", () => {
  it("renders text content", () => {
    render(<Text>Hello World</Text>)
    expect(screen.getByText("Hello World")).toBeInTheDocument()
  })

  it("renders as different HTML elements", () => {
    const { rerender } = render(<Text as="h1">Heading 1</Text>)
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()

    rerender(<Text as="h2">Heading 2</Text>)
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument()

    rerender(<Text as="p">Paragraph</Text>)
    expect(screen.getByText("Paragraph")).toBeInTheDocument()
  })

  it("applies size variants", () => {
    const { container } = render(<Text size="h1">Large Text</Text>)
    const element = container.firstChild
    expect(element).toHaveClass("text-4xl")
  })

  it("applies color variants", () => {
    const { container } = render(<Text color="destructive">Error Text</Text>)
    const element = container.firstChild
    expect(element).toHaveClass("text-destructive")
  })

  it("applies weight variants", () => {
    const { container } = render(<Text weight="bold">Bold Text</Text>)
    const element = container.firstChild
    expect(element).toHaveClass("font-bold")
  })

  it("defaults to div element", () => {
    const { container } = render(<Text>Default</Text>)
    expect(container.firstChild?.nodeName).toBe("DIV")
  })
})
