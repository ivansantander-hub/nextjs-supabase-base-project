import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./Button"

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole("button"))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("shows spinner when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>)
    const spinner = screen.getByRole("button").querySelector("svg")
    expect(spinner).toBeInTheDocument()
  })

  it("renders with icon on left by default", () => {
    const icon = <span data-testid="icon">🔍</span>
    render(<Button icon={icon}>Search</Button>)
    expect(screen.getByTestId("icon")).toBeInTheDocument()
  })

  it("renders with different variants", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-gradient-to-r")

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole("button")).toHaveClass("border-2")
  })
})
