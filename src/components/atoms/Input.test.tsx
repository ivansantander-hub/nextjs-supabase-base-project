import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Input } from "./Input"

describe("Input", () => {
  it("renders input field", () => {
    render(<Input />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("renders with label", () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
  })

  it("accepts user input", async () => {
    const user = userEvent.setup()
    const { container } = render(<Input />)
    const input = container.querySelector("input") as HTMLInputElement

    await user.type(input, "test value")
    expect(input.value).toBe("test value")
  })

  it("displays error message", () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText("This field is required")).toBeInTheDocument()
  })

  it("displays hint text", () => {
    render(<Input hint="Enter a valid email" />)
    expect(screen.getByText("Enter a valid email")).toBeInTheDocument()
  })

  it("shows error styles when error is present", () => {
    render(<Input error="Error!" />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveClass("border-red-500")
  })

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  it("renders with icon", () => {
    const icon = <span data-testid="search-icon">🔍</span>
    render(<Input icon={icon} />)
    expect(screen.getByTestId("search-icon")).toBeInTheDocument()
  })
})
