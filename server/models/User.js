import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Create the schema of the database
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true, // Ensure username is unique
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email'] // Email format validation
    },
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png"
    },
    password: {
        type: String,
        minlength: [6, 'Minimum length is 6 characters'],
        validate: {
            validator: function(value) {
                // Password must include at least one uppercase letter, one lowercase letter, and one number
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(value);
            },
            message: 'Password must include at least one uppercase letter, one lowercase letter, and one number.'
        }
    },
    googleId: {
        type: String,
        required: false, // This will store Google user ID for OAuth users
    },
    isUsernameCustomized: {
        type: Boolean,   // Field to indicate if the username was customized by the user
        default: false,  // Default value is false (automatically generated username)
    }
}, 
{ timestamps: true } // Save the date of creation/update
);

// Hash the password before saving it to the database
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method for password comparison (used for local login if needed)
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// Static method for login (can still be used for non-OAuth login scenarios)
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return user;
        }
        throw new Error("Incorrect password");
    }
    throw new Error("Incorrect email");
};

const User = mongoose.model("User", userSchema);

export default User;

