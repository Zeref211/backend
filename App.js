import express from"express"
const app= express();
import mysql from"mysql"
import cors from"cors"
import bodyparser from "body-parser";

import cookieparser from "cookie-parser";
app.use(cookieparser());
app.use(express.json());
app.use(bodyparser.json());



app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(bodyparser.urlencoded({extened:true}))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "store"
})

// Code resigter
app.post("/resigter",(req,res)=>{
    db.connect((err)=>{
        const values =[
            req.body.name,
            req.body.email,
            req.body.phone,
            req.body.password
        ]
        const sql ="INSERT INTO user (tenkh,email,phone,matkhau) values(?)"
    db.query(sql,[values],(err,data)=>{
        if(err){
            return res.json({Status:"Registration failed"})
        }
        else{
            return res.json(data)
        }
    })
    })
})


// end resigter
// product
app.get("/product",(req,res)=>{
  db.connect((err)=>{
    const sql="SELECT *FROM sanpham"
    db.query(sql,(err,data)=>{
        if(err){
            return res.json(err)
        }else{
            return res.json(data)
        }
    })
  })
})
// end product

app.listen(4000,()=>{
    console.log("Sever running ")
})