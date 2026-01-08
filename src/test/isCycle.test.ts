import { describe, it, expect } from 'vitest'
import { solution } from '../utils/isCycle'

describe('IsCycle Check', () => {
  it('should return true for a simple 3-vertex cycle: A=[3,1,2], B=[2,3,1]', () => {
    expect(solution([3, 1, 2], [2, 3, 1])).toBe(true)
  })

  it('should return false for non-cycle: A=[1,2,1], B=[2,3,3]', () => {
    expect(solution([1, 2, 1], [2, 3, 3])).toBe(false)
  })

  it('should return false for graph with self-loop: A=[1,2,3,4], B=[2,1,4,4]', () => {
    expect(solution([1, 2, 3, 4], [2, 1, 4, 4])).toBe(false)
  })

  it('should return false for two disjoint cycles: A=[1,2,3,4], B=[2,1,4,3]', () => {
    expect(solution([1, 2, 3, 4], [2, 1, 4, 3])).toBe(false)
  })

  it('should return false for multiple edges: A=[1,2,2,3,3], B=[2,3,3,4,5]', () => {
    expect(solution([1, 2, 2, 3, 3], [2, 3, 3, 4, 5])).toBe(false)
  })

  it('should return true for a 4-vertex cycle: A=[1,3,2,4], B=[4,1,3,2]', () => {
    expect(solution([1, 3, 2, 4], [4, 1, 3, 2])).toBe(true)
  })

  it('should return true for a single vertex with self-loop', () => {
    // A single vertex pointing to itself is technically a cycle of length 1
    expect(solution([1], [1])).toBe(true)
  })

  it('should return false for disconnected vertices', () => {
    // Vertices 1->2 and 3->4 but missing edges to complete
    expect(solution([1, 3], [2, 4])).toBe(false)
  })

  it('should return true for a 2-vertex cycle: A=[1,2], B=[2,1]', () => {
    expect(solution([1, 2], [2, 1])).toBe(true)
  })

  it('should return false for two self-loops: A=[1,2], B=[1,2]', () => {
    expect(solution([1, 2], [1, 2])).toBe(false)
  })

  it('should return false when vertex has multiple outgoing edges', () => {
    expect(solution([1, 1, 2], [2, 3, 1])).toBe(false)
  })

  it('should return false when vertex has multiple incoming edges', () => {
    expect(solution([1, 2, 3], [2, 2, 1])).toBe(false)
  })

  it('should return true for larger cycle: A=[1,2,3,4,5], B=[2,3,4,5,1]', () => {
    expect(solution([1, 2, 3, 4, 5], [2, 3, 4, 5, 1])).toBe(true)
  })
})

