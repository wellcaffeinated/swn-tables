import axios from 'axios'
import parse from 'csv-parse'

export function fetchDataTable(url){
  return axios(url).then(res => {
    return new Promise((resolve, reject) => {
      parse(res.data, {
        columns: true
      }, (err, rows) => {
        if (err){ return reject(err) }
        resolve(rows)
      })
    })
  })
}
