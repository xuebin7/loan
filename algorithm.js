/**
 * 等额本息 每月本金与利息之和相同，利息减少，本金增加
 * @param {number} P 初始本金
 * @param {number} N 还款期限
 * @param {number} R 月利率
 */
function calculateDebx(P, N, R) {
  const loanDetails = []
  // 总利息
  let totalInterest = 0
  // 每月还款额 = P * R * (1+R)^N / ((1+R)^N - 1)
  const monthTotal = P * R * Math.pow((1 + R), N) / (Math.pow((1 + R), N) - 1)
  for (let n = 1; n <= N; n++) {
    // 月利息
    const monthInterest = P * R
    totalInterest += monthInterest
    // 月本金
    let monthMoney = monthTotal - monthInterest
    if (n == N) {
      // 最后一个月的每月本金改为上个月的剩余本金
      monthMoney = P
    }
    // 剩余本金
    P = P - monthMoney
    loanDetails.push({
      n: n,
      monthTotal: monthTotal.toFixed(2),
      monthMoney: monthMoney.toFixed(2),
      monthInterest: monthInterest.toFixed(2),
      restMoney: P.toFixed(2)
    })
  }
  return {
    totalInterest: totalInterest.toFixed(2),
    details: loanDetails
  }
}

/**
 * 等额本金 每月本金相同，利息减少
 * @param {number} P 初始本金
 * @param {number} N 还款期限
 * @param {number} R 月利率
 */
function calculateDebj(P, N, R) {
  const loanDetails = []
  // 总利息
  let totalInterest = 0
  // 每月本金不变
  let monthMoney = P / N
  for (let n = 1; n <= N; n++) {
    // 月利息
    const monthInterest = P * R
    totalInterest += monthInterest
    // 月还款额
    const monthTotal = monthInterest + monthMoney
    if (n == N) {
      // 最后一个月的每月本金改为上个月的剩余本金
      monthMoney = P
    }
    // 剩余本金
    P = P - monthMoney
    loanDetails.push({
      n: n,
      monthTotal: monthTotal.toFixed(2),
      monthMoney: monthMoney.toFixed(2),
      monthInterest: monthInterest.toFixed(2),
      restMoney: P.toFixed(2)
    })
  }
  return {
    totalInterest: totalInterest.toFixed(2),
    details: loanDetails
  }
}