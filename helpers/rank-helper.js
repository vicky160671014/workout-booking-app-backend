const rankTool = {
  addRankIndex: array => {
    if (!array || !array.length) return []

    for (let i = 0; i < array.length; i++) {
      array[i].rankIndex = i + 1
    }
    return array
  }
}

module.exports = rankTool
