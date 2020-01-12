const { ReconstructionNode } = require('./classes')

function rbfs(graph, source, target, h, limit) {

  const nodesTrace = [], notes = [], fScores = {}, fBounds = {};
  let pathFound = [], GLOBAL_STEP = 0;

  fScores[source] = 0 + h[source];
  fBounds[source] = fScores[source];
  nodeNo = 0

  function internalRbfs(currNode, currBound) {
    GLOBAL_STEP++;
    if (GLOBAL_STEP > 1000) {
      nodesTrace.push(currNode.node);
      console.log("a possible reason for this is that none of the targets are reachable");
      return [true, -1, currNode];
    }

    let currNodeLabel = currNode.node;
    nodesTrace.push(currNodeLabel);
    console.log(`Visiting node '${currNodeLabel}' with bound <= ${currBound}`);

    if (currNode.nodeNo >= limit) {
      console
      return [false, fScores[currNode.parentNode.node], currNode.parentNode]
    }

    if (fScores[currNodeLabel] > currBound) {
      nodesTrace.push(currNodeLabel);
      console.log(`Current node's f-value (${fScores[currNodeLabel]}) is above the bound (${currBound}) -> backtracking`);
      return [false, fScores[currNodeLabel], currNode];
    }

    const isTarget = target.has(currNodeLabel);
    nodesTrace.push(currNodeLabel);
    console.log(`'${currNodeLabel}' is ${isTarget ? "" : "not"} a target node`);
    if (isTarget)
      return [true, currBound, currNode];

    let children = Object.keys(graph.outEdges[currNodeLabel]);
    nodesTrace.push(currNode.node);

    if (children.length == 0) {
      console.log(`'${currNode.node}' has no successors -> returning new F-bound of Infinity to signal dead end`);
      return [false, Infinity, currNode];
    }

    let currNodeVisited = fScores[currNodeLabel] < fBounds[currNodeLabel];
    let msg1 = (currNodeVisited ?
      `f(${currNodeLabel}) = ${fScores[currNodeLabel]} < F(${currNodeLabel}) = ${fBounds[currNodeLabel]}, so we know that '${currNodeLabel}' was visited before\
           -> inheritance, i.e. F(child) = max(F(parent = '${currNodeLabel}'), f(child))` :
      `f(${currNodeLabel}) = ${fScores[currNodeLabel]} >= F(${currNodeLabel}) = ${fBounds[currNodeLabel]}, so children's backed-up values are same as their \
          static values, i.e. F(child) = f(child)`);
    let msg2 = [];
    let localPriorityQueue = [];
    for (let i = 0; i < children.length; i++) {
      if (currNode.parentNode === null || currNode.parentNode.node !== children[i]) {

        let fScoreChild = (fScores[currNodeLabel] - h[currNodeLabel]) +
          graph.edges[graph.outEdges[currNodeLabel][children[i]]][2] + h[children[i]];
        fScores[children[i]] = fScoreChild;

        if (currNodeVisited) {
          fBounds[children[i]] = Math.max(fBounds[currNodeLabel], fScores[children[i]]);
          msg2.push(`F(${children[i]}) = max(${fBounds[currNodeLabel]}, ${fScores[children[i]]})`);
        }
        else {
          fBounds[children[i]] = fScores[children[i]];
          msg2.push(`F(${children[i]}) = ${fScores[children[i]]}`);
        }
        localPriorityQueue.push([children[i], fBounds[children[i]]]);
      }
    }
    console.log(`${msg1}: ${msg2.join(", ")}`);

    localPriorityQueue.sort((item1, item2) => item1[1] - item2[1]);

    while (localPriorityQueue[0][1] <= currBound) {
      let fBoundSibling = (localPriorityQueue.length == 1) ? Infinity : localPriorityQueue[1][1];

      nodesTrace.push(currNodeLabel);
      console.log(`Current local priority queue content: ${localPriorityQueue.map(nodeAndPriority =>
        `('${nodeAndPriority[0]}', f(${nodeAndPriority[0]}) = ${nodeAndPriority[1]})`).join(", ")}`);
      let foundGoal, newBound, goalNode

      if (currNode.nodeNo + 1 >= limit) {
        fBounds[currNodeLabel] = currBound;
        return [false, Infinity, currNode];
      } else {
        [foundGoal, newBound, goalNode] = internalRbfs(new ReconstructionNode(localPriorityQueue[0][0], currNode, currNode.nodeNo + 1), Math.min(currBound, fBoundSibling));
        if (foundGoal)
          return [true, currBound, goalNode];
      }

      nodesTrace.push(localPriorityQueue[0][0]);
      console.log(`Correcting backed-up value: F(${localPriorityQueue[0][0]}) = ${newBound}`);

      localPriorityQueue[0][1] = newBound;
      fBounds[localPriorityQueue[0][0]] = newBound;
      localPriorityQueue.sort((item1, item2) => item1[1] - item2[1]);
    }

    let [bestNode, bestBackedUpValue] = localPriorityQueue[0];
    nodesTrace.push(currNodeLabel);
    console.log(`Current best option (F(${bestNode}) = ${bestBackedUpValue}) is above the bound (${currBound}) -> returning new F-bound of ${bestBackedUpValue}`);

    return [false, bestBackedUpValue, currNode];
  }
  let [foundGoal, _, goalNode] = internalRbfs(new ReconstructionNode(source, null, nodeNo), Infinity);
  if (target.has(goalNode.node)) {
    let n = goalNode;
    while (n !== null) {
      pathFound.push(n.node);
      n = n.parentNode;
    }
    pathFound = pathFound.reverse();
    nodesTrace.push(pathFound[pathFound.length - 1]);
    console.log(`Found path: ${pathFound.join(">")}`);
  } else {
    nodesTrace.push(source);
    console.log(`No path found from '${source}' to {${Array.from(target).map(n => `'${n}'`).join(", ")}}`);
  }

  return [nodesTrace, pathFound, notes];
}

module.exports = { rbfs }