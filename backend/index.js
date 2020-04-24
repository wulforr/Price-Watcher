const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Watcher = require('./models/Watcher')
const axios = require('axios')
const cheerio = require('cheerio')
require('dotenv').config()
app.use(express.json())
app.use(cors())

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
  console.log('login')
  const body = req.body
  const user = await User.findOne({userName: body.userName})

  const isPasswordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)

  if(!(user && isPasswordCorrect)){
    res.status(401).json({
      err: 'username or password is incorrect'
    })
    return
  }

  const userToken = {
    userName: user.userName,
    id: user._id
  }

  const token = jwt.sign(userToken, process.env.SECRET)

  res.status(200).json({
    token,
    userInfo: {
      userName:user.userName,
      email: user.email,
      phone: user.phone
    }
  })
})

app.post('/api/watcher', async (req,res) => {
  const body = req.body
  const webpage = await axios.get(body.url)
  const $ = cheerio.load(webpage.data)
  const price = $('#priceblock_ourprice').text().substring(2)
  console.log('price',price)
  if(isNaN(price)){
    res.status(400).send('cannot process this website')
    return
  }

  const token = req.token

  const decodedToken = jwt.verify(token,process.env.SECRET)

  if(!token || !decodedToken.id){
    return response.status(401).json({
        err:'invalid or missing token'
    })
  }
  const user = await User.findById(decodedToken.id)

  console.log('price',price)

  const newWatcher = new Watcher({
    url: body.url,
    maxPrice:body.maxPrice,
    pastPrices: [{
      price,
      date: new Date()
    }],
    watching: true,
    User: user._id
  })
  const response = await newWatcher.save()
  user.priceWatchers = user.priceWatchers.concat(response._id)
  await user.save()
  res.send(response)
})

const sendEmail = (email) => {
  console.log('email', email)
  return new Promise(resolve =>
    setTimeout(() => {
      console.log('Operation performed:', email);
      resolve(email);
    }, 2000))
}

const getPrices = async () => {
  console.time('getprices')
  const watchers = await Watcher.find({watching: true}).populate({path: 'User'})
  console.log('watchers',watchers)
  let prices = []
  const ans = []
  
  const listOfPromises = watchers.map(ele => axios.get(ele.url))
  
  prices = await Promise.all(listOfPromises)
  
  for(let i =0; i<prices.length;i++){
    const $ = cheerio.load(prices[i].data)
    const price = $('#priceblock_ourprice').text().substring(2)
    ans.push(price)
  }

  const updatePrices = watchers.map((ele,index) => Watcher.findOneAndUpdate({_id: ele._id}, {$set: {pastPrices: ele.pastPrices.concat({price:ans[index],date: new Date()})}}))
  const resp = await Promise.all(updatePrices)
  const sendEmailPromise = []

  for(let i= 0; i<watchers.length;i++){
    if(ans[i]<watchers[i].maxPrice)
      sendEmailPromise.push(sendEmail(watchers[i].User.email))
  }
  
  const emails = await Promise.all(sendEmailPromise)
  console.log(emails)

  console.timeEnd('getprices')
  return ans
}


app.get('/updatePriceForAll', async (req,res) => {
  res.send('updating prices').status(200)
  await getPrices()
})

app.get('/api/user', async (req,res) => {
  const token = req.token
  const decodedToken = jwt.verify(token,process.env.SECRET)
  const userId = decodedToken.id
  console.log(userId)
  const user = await User.findById(userId).populate('priceWatchers')
  console.log(user)
  res.status(200).send(user.priceWatchers)
})

const PORT = 5000
app.listen(PORT, () => console.log('server started'))
