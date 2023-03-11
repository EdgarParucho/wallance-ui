import funds from '../data/funds.json'

const example = ['a', 'b']

export function Find(userID) {
  const fn = (fund) => fund.usersIDs.includes(userID)
  const data = funds.filter(fn)
  console.log(data);
  const response = { data, message: 'All your funds has been loaded.', succeed: true }
  return response
}

export function Create(fund) {
  fund._id = `f${funds.length}`
  funds.push(fund)
  const response = { data: fund, message: 'Confirmed: You have a new fund.', succeed: true }
  return response
}

export function Update(fund) {
  const index = funds.findIndex(f => f._id === fund._id)
  funds.splice(index, 1, fund)
  const response = { data: fund, message: 'Confirmed: You updated a fund.', succeed: true }
  return response
}

export function Delete(id) {
  const index = funds.findIndex(f => f._id === id)
  funds.splice(index, 1)
  const response = { data: null, message: 'Confirmed: You deleted a fund.', succeed: true }
  return response
}
