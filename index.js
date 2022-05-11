// Server creation 

// import express
const express=require('express')

// const req=require('express/lib/request')
// const res=require('express/lib/response')

const{ json } = require('express/lib/response')

// data service import
const dataService=require('./services/data.service')

// import jsonwebtoken
const jwt=require('jsonwebtoken')

//import cors
const cors=require('cors')

// create server app using express
const app=express()


// to connect front end
app.use(cors({
    origin:'http://localhost:4200'
}))

// to parse json data
app.use(express.json())

// resolving API call

// GET - to read data
app.get('/',(req,res)=>{
    res.send("GET STARTED")
})

// POST - to request data
app.post('/',(req,res)=>{
    res.send("POST REQUEST")
})

// PUT - to request data
app.put('/',(req,res)=>{
    res.send("PUT REQUEST")
})

// PATCH - to request data
app.patch('/',(req,res)=>{
    res.send("PATCH REQUEST")
})

// DELETE - to request data
app.delete('/',(req,res)=>{
    res.send("DELETE REQUEST")
})

// BANK SERVER

// token verify
const jwtMiddleware=(req,res,next)=>{
    try{
        const token=req.headers["x-access-token"]
        // console.log(jwt.verify(token,'secret123445')

        const data=jwt.verify(token,'secret123445')
        req.currentAcno=data.currentAcno
        next()
    }
    catch{
        res.status(401).json({
            statusCode:401,
            status:false,
            message:"Please log in.."
        })
    }
}

// REGISTER API
 

app.post('/register',(req,res)=>{
     dataService.register(req.body.uname,req.body.acno,req.body.password)
    // if(result){
    //     res.send("Sucessfully Registered")
    // }
    // else{
    //     res.send("Account Number already exist")
    // }

    // to set the error condition,ie status in 404 and 200
    .then(result=>{
    res.status(result.statusCode).json(result)
    })
})

// LOGIN API
app.post('/login',(req,res)=>{
    dataService.login(req.body.acno,req.body.pwd)
    .then(result=>{
        res.status(result.statuscode).json(result)
    })
})

// DEPOSIT API
app.post('/deposit',jwtMiddleware,(req,res)=>{
    dataService.deposit(req.body.acno,req.body.pwd,req.body.amount)
    .then(result=>{
        res.status(result.statuscode).json(result)
    })
})

// WITHDRAW API
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    dataService.withdraw(req,req.body.acno,req.body.pwd,req.body.amount)
    .then(result=>{
        res.status(result.statuscode).json(result)
    })
})

// TRANSACTION API
app.post('/transaction',jwtMiddleware,(req,res)=>{
    dataService.transaction(req.body.acno)
    .then(result=>{
        res.status(result.statuscode).json(result)
    })
})
// onDelete API
app.delete('/onDelete/:acno',jwtMiddleware,(req,res)=>{
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statuscode).json(result)

    })
})

// set port number
app.listen(3000,()=>{
    console.log("server started at 3000");
}) 

