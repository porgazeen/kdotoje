const date = new Date()
const year = date.getFullYear()
const month = date.getMonth()

function processPerson (person) {
  const name = person[1].split(' ')
  const initials = name.map(($) => {
    if ($.toLowerCase().startsWith('ch')) return ['c', 'h']
    else return $[0].toLowerCase()
  }).flat()

  return {
    name,
    initials,
    who: person[0]
  }
}

async function getPeople () {
  return (await (await fetch('names.csv')).text())
    .split('\n')
    .filter(($) => !$.startsWith('#') && $.includes(','))
    .map((n) => n.split(','))
    .map(processPerson)
}

function showWho (who) {
  const gradYear = parseInt(who)

  if (!isNaN(gradYear)) {
    const grade = month < 9
      ? gradYear - year
      : gradYear - year - 1

    return grade < 0 ? who : showGrade(grade)
  } else {
    return who
  }
}

function showGrade (grade) {
  switch (grade) {
    case 7:
      return 'prima'
    case 6:
      return 'sekunda'
    case 5:
      return 'tercie'
    case 4:
      return 'kvarta'
    case 3:
      return 'kvinta'
    case 2:
      return 'sexta'
    case 1:
      return 'septima'
    case 0:
      return 'oktáva'
    default:
      return grade.toString()
  }
}

function include (query, name) {
  if (query.length === 0) return true
  else {
    const q1 = Array.from(query).filter(($) => $.length > 0)
    const q2 = query.split(/[\.\s(\. )]+/).filter(($) => $.length > 0)
    return (
      isArrayOrderedSubset(name.initials, q1) || isArrayOrderedSubset(name.initials, q2)
    )
  }
}

function isArrayOrderedSubset (b, a) {
  let index = -1
  for (const aa of a) {
    index = b.indexOf(aa, index + 1)
    if (index === -1) return false
  }
  return true
}
