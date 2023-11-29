const adminController=require('../controllers/adminController')
const router=require('express').Router()
const { isAdminLoggedout, isAdmin } = require('../middlewares/auth')

router.get('/', isAdmin, (req, res) => {
    res.redirect('/admin/dashboard')
})


router.get('/login', isAdminLoggedout, adminController.showLogin)
router.post('/login', isAdminLoggedout, adminController.validlogin)


router.get('/dashboard', isAdmin, adminController.showUsers)

//create user 
router.get('/users/new', isAdmin, adminController.newUser)    
router.post('/users', isAdmin, adminController.createUser)

//edit user
router.get('/users/:id/editUser', isAdmin, adminController.showEditUser)
router.put('/user/:id', isAdmin, adminController.updateUser)

router.delete('/users/:id/destroy', isAdmin, adminController.deleteUser)
router.get('/logout',isAdmin,adminController.logout)


module.exports=router 