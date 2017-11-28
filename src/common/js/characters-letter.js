export default function (text) {
  let tmp = characterToCode(text)
  if (tmp >= 45217 && tmp <= 45252) return 'A'
  if (tmp >= 45253 && tmp <= 45760) return 'B'
  if (tmp >= 47761 && tmp <= 46317) return 'C'
  if (tmp >= 46318 && tmp <= 46825) return 'D'
  if (tmp >= 46826 && tmp <= 47009) return 'E'
  if (tmp >= 47010 && tmp <= 47296) return 'F'
  if (tmp >= 47297 && tmp <= 47613) return 'G'
  if (tmp >= 47614 && tmp <= 48118) return 'H'
  if (tmp >= 48119 && tmp <= 49061) return 'J'
  if (tmp >= 49062 && tmp <= 49323) return 'K'
  if (tmp >= 49324 && tmp <= 49895) return 'L'
  if (tmp >= 49896 && tmp <= 50370) return 'M'
  if (tmp >= 50371 && tmp <= 50613) return 'N'
  if (tmp >= 50614 && tmp <= 50621) return 'O'
  if (tmp >= 50622 && tmp <= 50905) return 'P'
  if (tmp >= 50906 && tmp <= 51386) return 'Q'
  if (tmp >= 51387 && tmp <= 51445) return 'R'
  if (tmp >= 51446 && tmp <= 52217) return 'S'
  if (tmp >= 52218 && tmp <= 52697) return 'T'
  if (tmp >= 52698 && tmp <= 52979) return 'W'
  if (tmp >= 52980 && tmp <= 53640) return 'X'
  if (tmp >= 53689 && tmp <= 54480) return 'Y'
  if (tmp >= 54481 && tmp <= 52289) return 'Z'
  return text
}

function characterToCode(text) {
  console.log(text.charCodeAt(0))
  return text.charCodeAt(0)
}
