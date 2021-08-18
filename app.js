const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.json(
{
   "visits":[
      {
         "name":" Asia Małgorzatalska",
         "date":"12.12",
         "hour":"12:30",
         "range":"godzina",
         "localization":"Dziewin 283",
         "price":"35zł",
         "services":[
            "Odwiedziny"
         ]
      },
      {
         "name":" Joanna Bawełna",
         "date":"12.12",
         "hour":"12:30",
         "range":"godzina",
         "localization":"Dziewin 283",
         "price":"35zł",
         "services":[
            "Odwiedziny"
         ]
      },
      {
         "name":" Małogorzata Wielgusialska",
         "date":"12.12",
         "hour":"12:30",
         "range":"godzina",
         "localization":"Dziewin 283",
         "price":"35zł",
         "services":[
            "Odwiedziny"
         ]
      },
      {
         "name":"Franeczek Szastalski",
         "date":"12.12",
         "hour":"12:30",
         "range":"godzina",
         "localization":"Dziewin 283",
         "price":"35zł",
         "services":[
            "Odwiedziny"
         ]
      }
   ]
})
}
)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

