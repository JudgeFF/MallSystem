const Router = require('koa-router')
let router = new Router()
const mongoose = require('mongoose')
const fs = require('fs')
const { connect, initSchemas } = require('../database/init')

router.get('/insertAllGoodsInfo', async (ctx) => {
    await connect()
    initSchemas()
    fs.readFile('./data_json/newGoods.json', 'utf8', (err, data) => {
        data = JSON.parse(data)
        let saveCount = 0
        const Goods = mongoose.model('Goods')
        data.map((value, index) => {
            console.log(value)
            let newGoods = new Goods(value)
            newGoods.save().then(() => {
                saveCount++
                console.log('成功' + saveCount)
            }).catch(error => {
                console.log('失败：' + error)
            })
        })
    })
    ctx.body = "开始导入数据"
})

router.post('/getDetailGoodsInfo', async (ctx) => {
    await connect()
    initSchemas()
    try {
        let goodsId = ctx.request.body.goodsId
        const Goods = mongoose.model('Goods')
        let result = await Goods.findOne({ ID: goodsId }).exec()
        ctx.body = { code: 200, message: result }
    } catch (err) {
        ctx.body = { code: 500, message: err }
    }

})

router.get('/getCategoryList', async (ctx) => {
    await connect()
    initSchemas()
    try {
        const Category = mongoose.model('Category')
        let result = await Category.find().exec()
        ctx.body = { code: 200, message: result }
    } catch (err) {
        ctx.body = { code: 500, message: err }
    }
})

// router.get('/getCategorySubList', async (ctx) => {
//     await connect()
//     initSchemas()
//     try {
//         //let categoryId = ctx.request.body.categoryId
//         let categoryId = 1
//         const CategorySub = mongoose.model('CategorySub')
//         let result = await CategorySub.find({ MALL_CATEGORY_ID: categoryId }).exec()
//         ctx.body = { code: 200, message: result }
//     } catch (err) {
//         ctx.body = { code: 500, message: err }
//     }

// })

router.post('/getCategorySubList', async (ctx) => {
    try {
        let categoryId = ctx.request.body.categoryId
        const CategorySub = mongoose.model('CategorySub')
        let result = await CategorySub.find({ MALL_CATEGORY_ID: categoryId }).exec()
        ctx.body = { code: 200, message: result }
    } catch (err) {
        ctx.body = { code: 500, message: err }
    }
})

// router.get('/getGoodsListByCategorySubID', async (ctx) => {
//     try {
//         //let categorySubId = ctx.request.body.categoryId
//         let categorySubId = '2c9f6c946016ea9b016016f79c8e0000'
//         const Goods = mongoose.model('Goods')
//         let result = await Goods.find({ SUB_ID: categorySubId }).exec()
//         ctx.body = { code: 200, message: result }
//     } catch (err) {
//         ctx.body = { code: 500, message: err }
//     }
// })

router.post('/getGoodsListByCategorySubID', async (ctx) => {
    try {
        let categorySubId = ctx.request.body.categorySubId //小类别
        let page = ctx.request.body.page
        let num = 10 //每页显示数量
        let start = (page - 1) * num
        //let categorySubId = '2c9f6c946016ea9b016016f79c8e0000'
        const Goods = mongoose.model('Goods')
        let result = await Goods.find({ SUB_ID: categorySubId }).skip(start).limit(num).exec()
        ctx.body = { code: 200, message: result }
    } catch (err) {
        ctx.body = { code: 500, message: err }
    }
})

module.exports = router;