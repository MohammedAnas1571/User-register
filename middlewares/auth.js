const user=require('../models/userModel')

//firstly login
const islogout= (req, res, next)=>{
    if(!req.session.user){
        next()
    }
    else{
        res.redirect('/')
    }
}

//already logined user
const islogged=(req,res,next)=>{
    if(req.session.user){
        req.user=req.session.user      //creating key-value in the req object as key-'user',value-'id in the session'
        next()
    }
    else{
        res.redirect('/login')
    }
}

const isAdmin = (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        res.redirect('/login')
    }
}

const isAdminLoggedout = (req, res, next) => {
    if (!req.session.admin) {
        next()
    } else {
        res.redirect('/admin/dashboard')
    }
} 


module.exports={
    islogout,
    islogged,
    isAdmin,
    isAdminLoggedout
}

