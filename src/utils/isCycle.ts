export function solution(A: number[], B: number[]): boolean {
  const n = A.length
  if (n === 0) return false

  const outEdge = new Map<number, number>()
  const inDegree = new Map<number, number>()
  const outDegree = new Map<number, number>()

  for (let i = 0; i < n; i++) {
    const from = A[i]
    const to = B[i]

    if (outEdge.has(from)) return false
    outEdge.set(from, to)
    outDegree.set(from, (outDegree.get(from) || 0) + 1)
    inDegree.set(to, (inDegree.get(to) || 0) + 1)
  }

  const allVertices = new Set<number>()
  for (let i = 0; i < n; i++) {
    allVertices.add(A[i])
    allVertices.add(B[i])
  }

  if (allVertices.size !== n) return false

  for (const vertex of allVertices) {
    if ((inDegree.get(vertex) || 0) !== 1) return false
    if ((outDegree.get(vertex) || 0) !== 1) return false
  }

  const startVertex = A[0]
  let current = startVertex
  const visited = new Set<number>()

  for (let i = 0; i < n; i++) {
    if (visited.has(current)) return false
    visited.add(current)
    current = outEdge.get(current)!
  }

  return current === startVertex && visited.size === n
}

export default solution
