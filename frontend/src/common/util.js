// -----------------------------------------------------------------------------
// Utility
// -----------------------------------------------------------------------------
const _FORMATTER = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });

const util = {
  // 税込価格を返す。
  //   -> 金額は切り上げ。
  calcTaxed: (price, tax) => Math.ceil(price * (100 + Number(tax))/100),

  // 日本円のフォーマットに合わせた文字列を返す。
  formatYen: (price) => _FORMATTER.format(price),

  // 日付けオブジェクトをYYYYMMDD形式で返す。
  dateToStr: (val) => {
      if (val.length !== 8) return val;
      const yyyy = val.substr(0, 4);
      const mm   = parseInt(val.substr(4, 2)) - 1;
      const dd   = val.substr(6, 2);
      return new Date(Date.UTC(yyyy, mm, dd));
  },
}

export default util;
