class DirectedWeightedGraph {

  constructor() {
    this.nodes = new Set()
    this.edges = {}
    this.inEdges = {}
    this.outEdges = {}
  }

  addNodesFrom(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      const nodeLabel = nodes[i]
      this.nodes.add(nodeLabel)
      this.inEdges[nodeLabel] = {}
      this.outEdges[nodeLabel] = {}
    }
  }

  addEdgesFrom(edges) {
    for (let edgeId in edges) {
      const [srcNode, dstNode, weight] = edges[edgeId]
      this.edges[edgeId] = edges[edgeId]
      this.inEdges[dstNode][srcNode] = edgeId
      this.outEdges[srcNode][dstNode] = edgeId
    }
  }
}

class ReconstructionNode {
  constructor(node, parentNode, nodeNo) {
    this.node = node
    this.parentNode = parentNode
    this.nodeNo = nodeNo
    this.visited = false
  }
}

class NodeGraphic {
  constructor(id, x, y, label, radius, heuristic) {
    this.id = id
    this.x = x
    this.y = y
    this.label = label
    this.r = radius
    this.h = heuristic
  }
}
let idxNewNode = 0

const getNewNodeId = () => `node${idxNewNode++}`

module.exports = { DirectedWeightedGraph, ReconstructionNode, NodeGraphic, getNewNodeId }