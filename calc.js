const category = [
  "Stock",
  "Long term bond",
  "Tips",
  "Company bond",
  "Emerging Government Bond",
  "Gold",
  "Commodity",
];
const normRatio = [35, 20, 20, 7.5, 7.5, 5, 5];

// 변동부분
const now = [
  16_069_468, 6_698_936, 5_804_206, 2_609_025, 2_654_786, 2_391_419, 1_830_396,
];
const KRW_USD_RATIO = 1230;

const nowSum = now.reduce((acc, cur) => acc + cur, 0);
const nowRatio = now.map((value) => +((value / nowSum) * 100).toFixed(2));

console.log("항목별 현재 보유 비중");
console.log(nowRatio);

const ratioAdjust = [];

for (let i = 0; i < normRatio.length; i++)
  ratioAdjust[i] = +(normRatio[i] - nowRatio[i]).toFixed(2);

console.log("리벨런싱 필요 비중");
console.log(ratioAdjust);

const amountAdjustKRW = [];
const amountAdjustUSD = [];
for (let i = 0; i < normRatio.length; i++) {
  const won = Math.round((nowSum * ratioAdjust[i]) / 100);
  amountAdjustKRW[i] = won.toLocaleString();
  amountAdjustUSD[i] = Math.round(won / KRW_USD_RATIO).toLocaleString();
}

console.log("리밸런싱 필요 금액(₩)");
console.log(amountAdjustKRW);

console.log("리밸런싱 필요 금액($)");
console.log(amountAdjustUSD);
