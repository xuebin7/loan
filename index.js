const P = document.getElementById("P")
const years = document.getElementById("years")
const rateOfInterest = document.getElementById("rateOfInterest")
const calculate = document.getElementById("calculate")
const totalInterest = document.getElementById("totalInterest")
let debxTotalInterestValue = 0.00
let debjTotalInterestValue = 0.00

const debxLabel = document.getElementById("debxLabel")
const debxBlock = document.getElementById("debxBlock")
const debxArea = document.getElementsByClassName("debxArea")
const debxTable = document.getElementById("debxTable")

const debjLabel = document.getElementById("debjLabel")
const debjBlock = document.getElementById("debjBlock")
const debjArea = document.getElementsByClassName("debjArea")
const debjTable = document.getElementById("debjTable")

// 默认显示等额本息
debxBlock.className = 'areaDisplay'
debjBlock.className = 'areaHide'
totalInterest.innerText = '0.00'

calculate.addEventListener('click', getLoanResult)

debxLabel.addEventListener('click', function () {
  // 点击等额本息时，显示等额本息，隐藏等额本金
  debxBlock.className = 'areaDisplay'
  debjBlock.className = 'areaHide'

  totalInterest.innerText = debxTotalInterestValue
})

debjLabel.addEventListener('click', function () {
  // 点击等额本金时，显示等额本金，隐藏等额本息
  debjBlock.className = 'areaDisplay'
  debxBlock.className = 'areaHide'

  totalInterest.innerText = debjTotalInterestValue
})

/**
 * 获取贷款利息
 */
function getLoanResult() {
  // 清空之前的数据
  debxTable.innerHTML = `
      <th>期数</th>
      <th>月还款额</th>
      <th>每月本金</th>
      <th>每月利息</th>
      <th>剩余本金</th>
  `

  debjTable.innerHTML = `
      <th>期数</th>
      <th>月还款额</th>
      <th>每月本金</th>
      <th>每月利息</th>
      <th>剩余本金</th>
  `

  // P 本金(万元), years 还款年限, rateOfInterest 年利率(%)
  const PValue = P.value * 10000, monthsValue = years.value * 12, rateOfInterestValue = rateOfInterest.value * 0.01

  let loanResult = loanCalculate(PValue, monthsValue, rateOfInterestValue)
  const debx = loanResult["debxResult"]
  const debj = loanResult["debjResult"]

  setDebxValue(debx)
  setDebjValue(debj)
}

/**
 * 等额本息表格赋值
 * @param {*} debx 等额本息结果
 */
function setDebxValue(debx) {
  debxTotalInterestValue = debx.totalInterest
  totalInterest.innerText = debx.totalInterest
  let debxDetails = debx.details
  let trHtml = ''
  for (const item of debxDetails) {
    trHtml += `<tr>
                  <td>${item.n}</td>
                  <td>${item.monthTotal}</td>
                  <td>${item.monthMoney}</td>
                  <td>${item.monthInterest}</td>
                  <td>${item.restMoney}</td>
              </tr>`
  }
  debxTable.innerHTML += trHtml
}

/**
 * 等额本金表格赋值
 * @param {*} debj 等额本金结果
 */
function setDebjValue(debj) {
  debjTotalInterestValue = debj.totalInterest
  totalInterest.innerText = debj.totalInterest
  let debjDetails = debj.details
  let trHtml = ''
  for (const item of debjDetails) {
    trHtml += `<tr>
                  <td>${item.n}</td>
                  <td>${item.monthTotal}</td>
                  <td>${item.monthMoney}</td>
                  <td>${item.monthInterest}</td>
                  <td>${item.restMoney}</td>
              </tr>`
  }
  debjTable.innerHTML += trHtml
}

/**
 * 贷款利息计算
 * @param {*} P 本金
 * @param {*} months 期数
 * @param {*} rateOfInterestValue 年利率
 */
function loanCalculate(P, months, rateOfInterestValue) {
  // 月利率
  const R = rateOfInterestValue / 12
  const debxResult = calculateDebx(P, months, R)
  const debjResult = calculateDebj(P, months, R)
  return {
    debxResult: debxResult,
    debjResult: debjResult
  }
}

/**
 * 等额本息 每月本金与利息之和相同，利息减少，本金增加
 * @param {*} P 初始本金
 * @param {*} N 还款期限
 * @param {*} R 月利率
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
 * @param {*} P 初始本金
 * @param {*} N 还款期限
 * @param {*} R 月利率
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