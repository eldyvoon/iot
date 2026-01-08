import { useState, useEffect, useRef, useCallback } from 'react'

const RunningClock = () => {
  const [minutes, setMinutes] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)
  const [totalSeconds, setTotalSeconds] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  
  const initialTimeRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const formatTime = useCallback((total: number): string => {
    const mins = Math.floor(total / 60)
    const secs = total % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startCountdown = useCallback(() => {
    clearTimer()
    intervalRef.current = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          clearTimer()
          setIsRunning(false)
          setIsPaused(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clearTimer])

  const handleStart = useCallback(() => {
    if (isRunning) {
      setTotalSeconds(initialTimeRef.current)
      setIsPaused(false)
    } else {
      const total = minutes * 60 + seconds
      initialTimeRef.current = total
      setTotalSeconds(total)
      setIsRunning(true)
      setIsPaused(false)
    }
  }, [isRunning, minutes, seconds])

  const handlePauseResume = useCallback(() => {
    if (!isRunning) return
    setIsPaused(!isPaused)
  }, [isRunning, isPaused])

  const handleReset = useCallback(() => {
    clearTimer()
    setMinutes(0)
    setSeconds(0)
    setTotalSeconds(0)
    setIsRunning(false)
    setIsPaused(false)
  }, [clearTimer])

  useEffect(() => {
    if (isRunning && !isPaused) {
      startCountdown()
    } else {
      clearTimer()
    }
    return () => clearTimer()
  }, [isRunning, isPaused, startCountdown, clearTimer])

  return (
    <div>
      <label>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value) || 0)}
        />
        {' '}Minutes
      </label>
      <label>
        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value) || 0)}
        />
        {' '}Seconds
      </label>
      <button onClick={handleStart}>START</button>
      <button onClick={handlePauseResume}>PAUSE / RESUME</button>
      <button onClick={handleReset}>RESET</button>
      <h1 data-testid="running-clock">{formatTime(totalSeconds)}</h1>
    </div>
  )
}

export default RunningClock
