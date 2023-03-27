const express = require("express");
const bp = require("body-parser");
const _ = require("lodash");
const mong = require("mongoose");

const app = express();

app.set("view engine",'ejs');
app.use(bp.urlencoded({extended: true}));
app.use(express.static("public"));

mong.connect("mongodb://127.0.0.1:27017/dbase")
.then(()=>{
    console.log("db server is runnning successfully")
})
.catch((e)=>{
    console.log(e)
})

const userschema = mong.Schema({
    name: {
        type: String,
        required: true
        },
    email: String,
    password: String,
    aadhar: String,
    licence: String
});

const User = mong.model("dbase",userschema);

app.get("/",function(req,res){
    res.render("firstpage");
})

app.get("/signup",function(req,res){
    res.render("signup",{errr:"none"});
})

app.post("/signup",function(req,res){
    const id = req.body.Aadhar;
    const fname = req.body.fullname;
    const pass = req.body.password;
    const cn_pass = req.body.cnf_password;
    if(pass != cn_pass){
        res.render("signup",{errr: "incorrect"});
    }
    else{
        var newUser = new User({
                    name: fname,
                    aadhar: id,
                    password: pass
        });
          
              newUser.save();
              res.redirect("/login")
            }
        });

app.get("/dsignup",function(req,res){
    res.render("dsignup",{errr:"none"});
})

app.post("/dsignup",function(req,res){
    const id = req.body.Email;
    const licence = req.body.Licence_Number;
    const fname = req.body.fullname;
    const pass = req.body.password;
    const cn_pass = req.body.cnf_password;
    if(pass != cn_pass){
        res.render("signup",{errr: "incorrect"});
    }
    else{
        var newUser = new User({
                    name: fname,
                    email: id,
                    licence: licence,
                    password: pass
        });
          
              newUser.save();
              res.redirect("/dlogin")
            }
        });

app.get("/login",function(req,res){
    res.render("login",{peop: "success"});
});

app.post("/login",function(req,res){
    let emai = req.body.ema;
    let passwd = req.body.pass;

    User.findOne({email: emai},function(err,foundedd){
        if(!err){
            // console.log(foundedd);
            if(foundedd === null){
                console.log("No Such Data Available");
                res.render("login",{peop: "fail"});
            }else{
                if(passwd === foundedd.password){
                    console.log("Login Successful!!!");
                    res.render("success",{person: foundedd.name});
                }
                else{
                    res.render("login",{peop: "fail"});
                }
            }
        }
    })
})

app.get("/dlogin",function(req,res){
    res.render("dlogin",{peop: "success"});
});


app.listen(3000,function(){
    console.log("App is running at port 3000");
})