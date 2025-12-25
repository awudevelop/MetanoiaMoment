import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with children', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('applies default styles', () => {
      render(<Card data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('rounded-xl')
      expect(card).toHaveClass('border')
      expect(card).toHaveClass('bg-white')
    })

    it('merges custom className', () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      )
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-class')
      expect(card).toHaveClass('rounded-xl')
    })

    it('forwards ref correctly', () => {
      const ref = vi.fn()
      render(<Card ref={ref}>Content</Card>)
      expect(ref).toHaveBeenCalled()
    })

    it('passes additional props', () => {
      render(
        <Card data-testid="test-card" role="article">
          Content
        </Card>
      )
      expect(screen.getByTestId('test-card')).toHaveAttribute('role', 'article')
    })
  })

  describe('CardHeader', () => {
    it('renders with children', () => {
      render(<CardHeader>Header content</CardHeader>)
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('applies default styles', () => {
      render(<CardHeader data-testid="header">Content</CardHeader>)
      expect(screen.getByTestId('header')).toHaveClass('p-6')
    })

    it('merges custom className', () => {
      render(
        <CardHeader className="custom-class" data-testid="header">
          Content
        </CardHeader>
      )
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('custom-class')
      expect(header).toHaveClass('p-6')
    })
  })

  describe('CardTitle', () => {
    it('renders as h3 element', () => {
      render(<CardTitle>Title</CardTitle>)
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })

    it('renders with children', () => {
      render(<CardTitle>Card Title</CardTitle>)
      expect(screen.getByText('Card Title')).toBeInTheDocument()
    })

    it('applies default styles', () => {
      render(<CardTitle>Title</CardTitle>)
      expect(screen.getByRole('heading')).toHaveClass('text-xl')
      expect(screen.getByRole('heading')).toHaveClass('font-semibold')
    })
  })

  describe('CardDescription', () => {
    it('renders with children', () => {
      render(<CardDescription>Description text</CardDescription>)
      expect(screen.getByText('Description text')).toBeInTheDocument()
    })

    it('applies default styles', () => {
      render(<CardDescription data-testid="desc">Description</CardDescription>)
      expect(screen.getByTestId('desc')).toHaveClass('text-sm')
      expect(screen.getByTestId('desc')).toHaveClass('text-warm-600')
    })
  })

  describe('CardContent', () => {
    it('renders with children', () => {
      render(<CardContent>Content area</CardContent>)
      expect(screen.getByText('Content area')).toBeInTheDocument()
    })

    it('applies default styles', () => {
      render(<CardContent data-testid="content">Content</CardContent>)
      const content = screen.getByTestId('content')
      expect(content).toHaveClass('p-6')
      expect(content).toHaveClass('pt-0')
    })
  })

  describe('CardFooter', () => {
    it('renders with children', () => {
      render(<CardFooter>Footer content</CardFooter>)
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('applies default styles', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>)
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('flex')
      expect(footer).toHaveClass('items-center')
      expect(footer).toHaveClass('p-6')
    })
  })

  describe('Composed Card', () => {
    it('renders a complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>This is a test card</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main content here</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByRole('heading', { name: 'Test Card' })).toBeInTheDocument()
      expect(screen.getByText('This is a test card')).toBeInTheDocument()
      expect(screen.getByText('Main content here')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })
})
