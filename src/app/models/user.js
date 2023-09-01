import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'

const AnnotationInner = new mongoose.Schema([String, {
    type: String,
    cfiRange: String,
    data: {
      data: String,
      epubcfi: String,
      section: String,
      text: String,
      time: String,
      title: String,
    },
    sectionIndex: Number
}])


const booksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
    },
    annotations: [mongoose.Schema.Types.Mixed],
    loc: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: [true, "Account already exists"],
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, "Please enter your email"],
        minLength: [6, "Your password must be at least 6 characters long"],
        select: false, //dont send back password after request
    },
    role: {
        type: String,
        default: 'user',
        enum: {
            values: [
                'user',
                'admin'
            ],
        }
    },
    books: [booksSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
})

// ENCRYPTION 
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}


export default mongoose.models.User || mongoose.model('User', userSchema)