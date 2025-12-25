import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../components/input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders with a label when provided', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('associates label with input correctly', () => {
    render(<Input label="Username" id="username-input" />)
    const input = screen.getByLabelText('Username')
    expect(input).toHaveAttribute('id', 'username-input')
  })

  it('generates a unique id when not provided', () => {
    render(<Input label="Password" />)
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('id')
  })

  it('handles value changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('displays error message when error prop is provided', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('applies error styles when error prop is provided', () => {
    render(<Input error="Error" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('supports different input types', () => {
    render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('passes additional props to input element', () => {
    render(<Input data-testid="custom-input" maxLength={50} />)
    const input = screen.getByTestId('custom-input')
    expect(input).toHaveAttribute('maxLength', '50')
  })

  it('merges custom className with default styles', () => {
    render(<Input className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
    expect(input).toHaveClass('rounded-lg')
  })

  it('applies placeholder correctly', () => {
    render(<Input placeholder="Enter your email" />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })
})
