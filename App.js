import express from"express"
const app= express();
import mysql from"mysql"
import cors from"cors"
import bodyparser from "body-parser";
import jwt from"jsonwebtoken"

import cookieparser from "cookie-parser";
app.use(cookieparser());
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static("public"))



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
const verifyUser =(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.json({Message:"Bạn đã sai"});
    }
    else{
        jwt.verify(token,"jwt-secret-key",(err,decoded)=>{
            if(err){
                return res.json({Message:"Bạn đã sai"})
            }
            else{
                req.name=decoded.name;
                next();
            }
        })
    }
}
app.get('/auth',verifyUser,(req,res)=>{
    return res.json({ Status:"Success", name: req.name});
})
//login
app.post('/login', (req, res) => {
    db.connect((err) => {
        if (err) {
            return res.json('Lỗi kết nối database');
        }
        const sql = 'SELECT * FROM user WHERE email = ? AND matkhau = ?';
        db.query(sql, [req.body.email, req.body.matkhau], (err, data) => {
            if (err) {
                return res.json('Tài khoản hoặc mật khẩu đã sai');
            }
            if (data.length > 0) {
                const name = data[0].tenkh;
                console.log(name);
                const token = jwt.sign({ name }, "jwt-secret-key", { expiresIn: '1d' });
                res.cookie('token', token);
                return res.json({ Status: "Success" });
            } else {
                return res.json({ Status: "not Success" });
            }
        });
    });
});
//end login 

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
// chitietsp
app.get("/product/:id",(req,res)=>{
    db.connect((err)=>{
        const sql="SELECT *FROM sanpham where masp=?"
        db.query (sql,[req.params.id],(err,data)=>{
            if(err){
                return res.json(err)
            }else{
                return res.json(data)
            }
        })
    })

})
//end chitiet
app.get("/qlp",(req,res)=>{
    db.connect((err)=>{
        const sql="SELECT *FROM sanpham"
        db.query (sql,(err,data)=>{
            if(err){
                return res.json(err)
            }else{
                return res.json(data)
            }
        })
    })
})
//delete
app.get("/deletep/:id",(req,res)=>{
    db.connect((err)=>{
        const sql="DELETE from sanpham where masp=?"
        db.query(sql,[req.params.id],(err,data)=>{
            if(err){
                return res.json(err)
            }else{
                return res.json(data)
            }
        })
    })
})
//end delete

//create p
app.post("/createp",(req,res)=>{
    db.connect((err)=>{
        const sql="INSERT INTO  sanpham (`masp`,`tensp`,`gia`,`hinh`,`mota`,`maloaisp`,`soluong`) VALUES(?)";
        const values=[
            req.body.masp,
            req.body.tensp,
            req.body.gia,
            req.body.hinh,
            req.body.mota,
            req.body.maloaisp,
            req.body.soluong
        ]
    db.query(sql,[values],(err,data)=>{
        if(err){
            return res.json(err)
        }else{
            return res.json(data)
        }
    })
    })
})
// end create p
//sreach
app.post("/sreach/:ten",(req,res)=>{
    db.connect((err)=>{
        
        const sql=`SELECT *FROM sanpham where tensp LIKE '%${req.params.ten}%'`;
    db.query(sql,(err,data)=>{
        if(err){
            return res.json(err)
        }else{
            return res.json(data)
        }
    })
    })
})
// end sreach
// updatep
app.post('/updatep/:id',(req,res)=>{
    db.connect((err)=>{
       
        const sql=`UPDATE sanpham set tensp=?, gia=?, hinh=?, mota=?, maloaisp=?, soluong=? where masp=?`
    db.query(sql,[req.body.tensp,
        req.body.gia,
        req.body.hinh,
        req.body.mota,
        req.body.maloaisp,
        req.body.soluong,req.params.id],(err,data)=>{
        if(err){
            return res.json(err)
        }else{
            return res.json(data)
        }
    })
    })
    
})
// end updatep
// qlu
app.get("/qlu",(req,res)=>{
    db.connect((err)=>{
        const sql=`SELECT * from user`
    db.query(sql,(err,data)=>{
        if(err){
            return res.json(err)
        }else{
            return res.json(data)
        }
    })
    })
})
//end qlu
// create u 
app.post("/createu",(req,res)=>{
    db.connect((err)=>{
        const sql="INSERT INTO user(`tenkh`,`email`,`phone`,`diachi`,`matkhau`)VALUES(?)"
        const values=[
            req.body.tenkh,
            req.body.email,
            req.body.phone,
            req.body.diachi,
            req.body.matkhau
        ]
    db.query(sql,[values],(err,data)=>{
        if(err){
            return res.json(err)
        }else{
            return res.json(data)
        }
    })
    })
})
// end create u
// delete u
app.get("/deleteu/:id",(req,res)=>{                                                 
    db.connect((err)=>{
        const sql="DELETE  from user where makh=?"
        db.query(sql,[req.params.id],(err,data)=>{
        if(err){
            return res.json(err)
        }else{
            return res.json(data)
        }
    })
    })
})
// end delete u
//update  u
app.post('/updateu/:id',(req,res)=>{
    db.connect((err)=>{
        const sql="UPDATE user set tenkh=?,email=?,phone=?,diachi=?,matkhau=? where makh=?"
    db.query(sql,[req.body.tenkh, 
                req.body.email,
                req.body.phone,
                req.body.diachi,
                req.body.matkhau,
                req.params.id                
    ],(err,data)=>{
        if(err){
            return res.json(err)
        }else{
            return res.json(data)
        }
    })
    })
})
// end  u
app.listen(4000,()=>{
    console.log("Sever running ")
})