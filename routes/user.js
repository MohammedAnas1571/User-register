const {showLogin,validlogin,showDashboard,insertUser,loadRegister,logout,editProfile,updateUser}=require('../controllers/userController')
const router=require('express').Router()
const { islogout,islogged }=require('../middlewares/auth')



router.get('/login',islogout,showLogin)
router.post('/login',islogout,validlogin)

router.get('/register',islogout,loadRegister)
router.post('/register',islogout, insertUser)

router.get('/',islogged, showDashboard)
router.post('/logout',islogged,logout)

router.get('/users/:id/editUser',islogged,editProfile)
router.put('/user/:id',islogged,updateUser)




module.exports=router
