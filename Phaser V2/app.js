const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/score', (req, res) => {
    const score = req.body.score
    console.log(score)
    res.send('Good job!')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
