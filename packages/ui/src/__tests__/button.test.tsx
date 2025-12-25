import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../components/button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when loading prop is true', () => {
    render(<Button loading>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows spinner when loading', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument()
  })

  describe('variants', () => {
    it('applies primary variant styles by default', () => {
      render(<Button>Primary</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-primary-500')
    })

    it('applies secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-secondary-500')
    })

    it('applies outline variant styles', () => {
      render(<Button variant="outline">Outline</Button>)
      expect(screen.getByRole('button')).toHaveClass('border-primary-500')
    })

    it('applies ghost variant styles', () => {
      render(<Button variant="ghost">Ghost</Button>)
      expect(screen.getByRole('button')).toHaveClass('text-warm-700')
    })

    it('applies link variant styles', () => {
      render(<Button variant="link">Link</Button>)
      expect(screen.getByRole('button')).toHaveClass('text-primary-600')
    })

    it('applies destructive variant styles', () => {
      render(<Button variant="destructive">Delete</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-red-500')
    })
  })

  describe('sizes', () => {
    it('applies medium size by default', () => {
      render(<Button>Medium</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-11')
    })

    it('applies small size', () => {
      render(<Button size="sm">Small</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-9')
    })

    it('applies large size', () => {
      render(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-14')
    })
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Button ref={ref}>Button</Button>)
    expect(ref).toHaveBeenCalled()
  })

  it('passes additional props to button element', () => {
    render(
      <Button data-testid="custom-button" type="submit">
        Submit
      </Button>
    )
    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('merges custom className with default styles', () => {
    render(<Button className="custom-class">Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('bg-primary-500')
  })
})
