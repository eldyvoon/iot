import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import RunningClock from '../components/RunningClock'

describe('RunningClock', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should display initial time as 00:00', () => {
    render(<RunningClock />)
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:00')
  })

  it('should not change display when inputs change (before START)', () => {
    render(<RunningClock />)
    const inputs = screen.getAllByRole('spinbutton')
    
    fireEvent.change(inputs[0], { target: { value: '5' } })
    fireEvent.change(inputs[1], { target: { value: '30' } })
    
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:00')
  })

  it('should start countdown when START is clicked', () => {
    render(<RunningClock />)
    const inputs = screen.getAllByRole('spinbutton')
    
    fireEvent.change(inputs[0], { target: { value: '1' } })
    fireEvent.change(inputs[1], { target: { value: '5' } })
    
    fireEvent.click(screen.getByText('START'))
    
    expect(screen.getByTestId('running-clock')).toHaveTextContent('01:05')
  })

  it('should count down every second', () => {
    render(<RunningClock />)
    const inputs = screen.getAllByRole('spinbutton')
    
    fireEvent.change(inputs[0], { target: { value: '0' } })
    fireEvent.change(inputs[1], { target: { value: '5' } })
    
    fireEvent.click(screen.getByText('START'))
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:05')
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:04')
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:03')
  })

  it('should handle 65 seconds as 02:05', () => {
    render(<RunningClock />)
    const inputs = screen.getAllByRole('spinbutton')
    
    fireEvent.change(inputs[0], { target: { value: '1' } })
    fireEvent.change(inputs[1], { target: { value: '65' } })
    
    fireEvent.click(screen.getByText('START'))
    
    // 1 minute + 65 seconds = 125 seconds = 2:05
    expect(screen.getByTestId('running-clock')).toHaveTextContent('02:05')
  })

  it('should stop at 00:00', () => {
    render(<RunningClock />)
    const inputs = screen.getAllByRole('spinbutton')
    
    fireEvent.change(inputs[0], { target: { value: '0' } })
    fireEvent.change(inputs[1], { target: { value: '2' } })
    
    fireEvent.click(screen.getByText('START'))
    
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:00')
  })

  it('should pause and resume the countdown', () => {
    render(<RunningClock />)
    const inputs = screen.getAllByRole('spinbutton')
    
    fireEvent.change(inputs[0], { target: { value: '0' } })
    fireEvent.change(inputs[1], { target: { value: '10' } })
    
    fireEvent.click(screen.getByText('START'))
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:08')
    
    // Pause
    fireEvent.click(screen.getByText('PAUSE / RESUME'))
    
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    // Should still be 00:08 (paused)
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:08')
    
    // Resume
    fireEvent.click(screen.getByText('PAUSE / RESUME'))
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:06')
  })

  it('should reset inputs and display to 00:00', () => {
    render(<RunningClock />)
    const inputs = screen.getAllByRole('spinbutton')
    
    fireEvent.change(inputs[0], { target: { value: '5' } })
    fireEvent.change(inputs[1], { target: { value: '30' } })
    
    fireEvent.click(screen.getByText('START'))
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    fireEvent.click(screen.getByText('RESET'))
    
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:00')
    expect(inputs[0]).toHaveValue(0)
    expect(inputs[1]).toHaveValue(0)
  })

  it('should restart with original time when START clicked while running', () => {
    render(<RunningClock />)
    const inputs = screen.getAllByRole('spinbutton')
    
    fireEvent.change(inputs[0], { target: { value: '0' } })
    fireEvent.change(inputs[1], { target: { value: '10' } })
    
    fireEvent.click(screen.getByText('START'))
    
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:07')
    
    // Click START again - should restart with same input values
    fireEvent.click(screen.getByText('START'))
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:10')
  })

  it('should restart with ORIGINAL time even if inputs changed while running', () => {
    render(<RunningClock />)
    const inputs = screen.getAllByRole('spinbutton')
    
    fireEvent.change(inputs[0], { target: { value: '0' } })
    fireEvent.change(inputs[1], { target: { value: '10' } })
    
    fireEvent.click(screen.getByText('START'))
    
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:07')
    
    fireEvent.change(inputs[1], { target: { value: '5' } })
    
    fireEvent.click(screen.getByText('START'))
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:10')
  })

  it('should restart with ORIGINAL time when START clicked while paused', () => {
    render(<RunningClock />)
    const inputs = screen.getAllByRole('spinbutton')
    
    fireEvent.change(inputs[0], { target: { value: '0' } })
    fireEvent.change(inputs[1], { target: { value: '10' } })
    
    fireEvent.click(screen.getByText('START'))
    
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    
    fireEvent.click(screen.getByText('PAUSE / RESUME'))
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:07')
    
    fireEvent.click(screen.getByText('START'))
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:10')
  })

  it('should use NEW input values after countdown completes and START clicked', () => {
    render(<RunningClock />)
    const inputs = screen.getAllByRole('spinbutton')
    
    fireEvent.change(inputs[0], { target: { value: '0' } })
    fireEvent.change(inputs[1], { target: { value: '2' } })
    
    fireEvent.click(screen.getByText('START'))
    
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:00')
    
    fireEvent.change(inputs[1], { target: { value: '15' } })
    fireEvent.click(screen.getByText('START'))
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:15')
  })

  it('should not clear inputs on START click', () => {
    render(<RunningClock />)
    const inputs = screen.getAllByRole('spinbutton')
    
    fireEvent.change(inputs[0], { target: { value: '2' } })
    fireEvent.change(inputs[1], { target: { value: '30' } })
    
    fireEvent.click(screen.getByText('START'))
    
    expect(inputs[0]).toHaveValue(2)
    expect(inputs[1]).toHaveValue(30)
  })

  it('PAUSE/RESUME should do nothing before clock starts', () => {
    render(<RunningClock />)
    
    fireEvent.click(screen.getByText('PAUSE / RESUME'))
    expect(screen.getByTestId('running-clock')).toHaveTextContent('00:00')
  })
})

