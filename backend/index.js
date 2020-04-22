const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
app.use(express.json())
app.use(cors())
const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Watcher = require('./models/Watcher')
const axios = require('axios')
const cheerio = require('cheerio')

const url = process.env.MONGOURI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(res => console.log('mongodb connected'))
  .catch(err => console.log(err))

mongoose.set('useFindAndModify', false);

const getToken = (req, res, next) => {
  const authorization = req.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    req.token = authorization.substring(7)
  }
  next()
}

app.use(getToken)

  app.get('/', (req, res) => {
  res.send('Working')
})

app.post('/api/user', async (req, res) => {
  const body = req.body

  const saltRounds = 10
  const hashedpass = await bcrypt.hash(body.password, saltRounds)
  const newUser = new User({
    name: body.name,
    userName: body.userName,
    passwordHash: hashedpass,
    email: body.email,
    phone: body.phone,
    priceWatchers: []
  })
  const response = await newUser.save()
  res.send(response)

})

app.post('/api/user/login', async (req,res) => {
  const body = req.body
  const user = await User.findOne({userName: body.userName})

  const isPasswordCorrect = user === null ? false : await bcrypt.compare(body.userName, user.passwordHash)

  const userToken = {
    userName: user.userName,
    id: user._id
  }

  const token = jwt.sign(userToken, process.env.SECRET)

  res.status(200).json({
    token,
    userName:user.userName,
    name: user.name
  })
})

app.post('/api/watcher', async (req,res) => {
  const body = req.body
  const newWatcher = new Watcher({
    url: body.url,
    watching: true
  })
  const response = await newWatcher.save()
  res.send(response)
})

const getPrices = async () => {
  console.time('getprices')
  const watchers = await Watcher.find({watching: true})
  let prices = []
  const ans = []
  const listOfPromises = watchers.map(ele => axios.get(ele.url))
  // for (const promise of listOfPromises) {
    //   const req = await promise
    //   prices.push(req)
    // }
  prices = await Promise.all(listOfPromises)
  
  for(let i =0; i<prices.length;i++){
    const $ = cheerio.load(prices[i].data)
    const price = $('#priceblock_ourprice').text()
    ans.push(price)
  }

  const updatePrices = watchers.map((ele,index) => Watcher.findOneAndUpdate({_id: ele._id}, {$set: {pastPrices: ele.pastPrices.concat({price:ans[index],date: new Date()})}}))
  const resp = await Promise.all(updatePrices)
  console.log(resp)
  console.timeEnd('getprices')
  return ans
  // watchers.forEach(element => {
  //   prices.push(axios.get(element.url))
  // });
  // const finalprices =await Promise.all(watchers.map(ele => axios.post(ele.url)))
  // // const finalprices = await Promise.all(prices)
  // finalprices.forEach(ele => {
  //   const $ = cheerio.load(ele.data)
  //   const price = $('#priceblock_ourprice').text()
  //   ans.push(price)
  // })
  // return ans
}

app.get('/price', async (req,res) => {
  const price = await getPrices()
  res.send(price)
})

const PORT = 5000
app.listen(PORT, () => console.log('server started'))
