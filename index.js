
const { DirectedWeightedGraph } = require('./classes')
const { rbfs } = require('./rbfs')
const { nodes, edges, selectedStart, selectedGoals } = require('./data')

let dwg = new DirectedWeightedGraph()
let idxNewEdge = 0
const getNewEdgeId = () => `edge${idxNewEdge++}`

let nodeData = nodes
let edgesWithoutId = edges
let edgeList = {}
edgesWithoutId.forEach(edge => edgeList[getNewEdgeId()] = edge)

function getHeuristicScores() {
    let h = {}
    Object.values(nodeData).forEach(drawnNodeObj => h[drawnNodeObj.label] = drawnNodeObj.h)
    return h
}

function StartRBFS() {
    dwg.addNodesFrom(Object.keys(nodeData))
    dwg.addEdgesFrom(edgeList)
    rbfs(dwg, selectedStart, selectedGoals, getHeuristicScores(), 5)
    const startNode = selectedStart == null ? "<NO START>" : `'${selectedStart}'`
    const goalNodes = selectedGoals.size == 0 ? "<NO GOAL>" : `{${Array.from(selectedGoals).map(n => `'${n}'`).join(", ")}}`
    console.log("From " + startNode + " to " + goalNodes)
}

StartRBFS()
