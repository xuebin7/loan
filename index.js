const P = document.getElementById('P')
const yearsSelect = document.getElementById('years-select')
const months = document.getElementById('months')
const rateOfInterest = document.getElementById('rateOfInterest')
const calculate = document.getElementById('calculate')
const totalInterest = document.getElementById('totalInterest')
let debxTotalInterestValue = '0.00'
let debjTotalInterestValue = '0.00'

const debxLabel = document.getElementById('debxLabel')
const debxBlock = document.getElementById('debxBlock')
const debxTable = document.getElementById('debxTable')

const debjLabel = document.getElementById('debjLabel')
const debjBlock = document.getElementById('debjBlock')
const debjTable = document.getElementById('debjTable')

initYearSelect()

// 默认显示等额本息
debxLabelClick()

yearsSelect.addEventListener('change', yearsSelectChange)
debxLabel.addEventListener('click', debxLabelClick)
debjLabel.addEventListener('click', debjLabelClick)
calculate.addEventListener('click', calculateLoanResult)

/**
 * 获取贷款利息
 */
function calculateLoanResult() {
  const headerHtml = `<th>期数</th>
                    <th>月还款额</th>
                    <th>每月本金</th>
                    <th>每月利息</th>
                    <th>剩余本金</th>`
  // 清空之前的数据
  debxTable.innerHTML = headerHtml
  debjTable.innerHTML = headerHtml

  // P 本金(万元), months 还款期数, rateOfInterest 年利率(%)
  const PValue = P.value * 10000, monthsValue = months.value, rateOfInterestValue = rateOfInterest.value * 0.01
  let loanResult = loanCalculate(PValue, monthsValue, rateOfInterestValue)
  setTableValue({ debj: loanResult['debjResult'], debx: loanResult['debxResult'] })

  // 点击计算按钮时，默认显示等额本息内容
  debxLabelClick()
}

/**
 * 初始化年限下拉框
 */
function initYearSelect() {
  const totalYears = 30
  let optoinHtml = `<option value=0>自定义</option>`
  for (let index = 1; index <= totalYears; index++) {
    optoinHtml += `<option value=${index}>${index}</option>`
  }
  yearsSelect.innerHTML = optoinHtml
}

/**
 * 填充表格数据
 * @param {Object} data 数据
 */
function setTableValue(data) {
  const debj = data['debj']
  debjTotalInterestValue = debj.totalInterest
  totalInterest.innerText = debjTotalInterestValue
  debjTable.innerHTML += getTrHtml(debj.details)

  const debx = data['debx']
  debxTotalInterestValue = debx.totalInterest
  totalInterest.innerText = debxTotalInterestValue
  debxTable.innerHTML += getTrHtml(debx.details)
}

/**
 * 构造表格行Html
 * @param {Object} details 详情
 * @returns 表格行Html
 */
function getTrHtml(details) {
  return details.map(item =>
    `<tr>
      <td>${item.n}</td>
      <td>${item.monthTotal}</td>
      <td>${item.monthMoney}</td>
      <td>${item.monthInterest}</td>
      <td>${item.restMoney}</td>
    </tr>`
  ).join('')
}

/**
 * 年限下拉框更改事件
 */
function yearsSelectChange(event) {
  const selectedYear = event.target.value
  const selectedIntYear = Number.parseInt(selectedYear)
  if (selectedIntYear === 0) {
    months.disabled = false
    months.value = ''
  } else {
    months.disabled = true
    months.value = selectedIntYear * 12
  }
}

/**
 * 点击等额本息时，显示等额本息，隐藏等额本金
 */
function debxLabelClick() {
  debxBlock.className = 'areaDisplay'
  debjBlock.className = 'areaHide'
  totalInterest.innerText = debxTotalInterestValue
}

/**
 * 点击等额本金时，显示等额本金，隐藏等额本息
 */
function debjLabelClick() {
  debjBlock.className = 'areaDisplay'
  debxBlock.className = 'areaHide'
  totalInterest.innerText = debjTotalInterestValue
}

/**
 * 贷款利息计算
 * @param {number} P 本金
 * @param {number} months 期数
 * @param {number} rateOfInterestValue 年利率
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