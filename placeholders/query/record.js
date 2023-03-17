import records from '../data/records.json'

export function Find() {
  const data = [...records]
  const response = { data, message: 'All your records has been loaded.', succeed: true }
  return response
}

export function Create(record) {
  record._id = `r${records.length}`
  records.push(record)
  const response = { data: record, message: 'Confirmed: You created a record.', succeed: true }
  return response
}

export function Update(record) {
  const index = records.findIndex(f => f._id === record._id)
  records.splice(index, 1, record)
  const response = { data: record, message: 'Confirmed: You updated a record.', succeed: true }
  return response
}

export function Delete(id) {
  const index = records.findIndex(f => f._id === id)
  records.splice(index, 1)
  const response = { data: null, message: 'Confirmed: You deleted a record.', succeed: true }
  return response
}
