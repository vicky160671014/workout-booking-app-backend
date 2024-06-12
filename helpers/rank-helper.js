const rankTool = {
  addRankIndex: array => {
    if (!array || !array.length) return []

    for (let i = 0; i < array.length; i++) {
      array[i].rankIndex = i + 1
    }
    return array
  },
  myRank: (userId, allRank) => {
    const ranks = rankTool.addRankIndex(allRank)
    const findMyRank = ranks.find(r => r.user_id === userId)
    if (findMyRank) { return findMyRank.rankIndex } else { return null }
  }
}

module.exports = rankTool
