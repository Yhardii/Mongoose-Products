const express = require('express')
const app = express()
const path = require('path')
const Product = require('./models/product')
const methodOverride = require('method-override')

const mongoose = require('mongoose')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/farmStand');
    console.log('Hurray')
  
}

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
const category = ['fruit', 'vegetable', 'dairy']




app.get('/products',async (req, res)=>{
    const {category} = req.query
    console.log(category)
    if(category){
        const products = await Product.find({category: category})
        let filter = true
        console.log(products)
        res.render('products/index.ejs', {products, filter})
        
    }else{
        const products = await Product.find()
        let filter = false
        console.log('hi')
        res.render('products/index.ejs', {products, filter})
    }
    
})

app.get('/products/new', (req, res)=>{
    res.render('products/new', {category})
})

app.get('/product/:id', async (req, res)=>{
    const {id} = req.params
    const products = await Product.findById(id)
    res.render('products/show.ejs', {products})
})


app.get('/product/:id/edit', async (req, res)=>{
    const {id} = req.params
    const product = await Product.findById(id)
    res.render('products/edit', {product, category})
})

app.post('/products', async (req, res)=>{
    const newProduct = new Product(req.body)
    await newProduct.save()
    console.log(newProduct)
    res.redirect(`/product/${newProduct._id}`)
})

app.put('/products/:id', async (req, res)=>{
    const {id} = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    console.log(req.body)
    res.redirect(`/product/${product._id}`)
})

app.delete('/product/:id', async(req, res)=>{
    const {id} = req.params
    const product = await Product.findByIdAndDelete(id, {runValidators: true, new: true})
    res.redirect('/products')

})



app.listen(3000, ()=>{
    console.log('Listening at port 3000')
})
