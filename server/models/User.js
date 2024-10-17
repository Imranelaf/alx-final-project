import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const accountStatusEnum = ['active', 'pending', 'suspended', 'deactivated'];

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
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
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
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(value);
            },
            message: 'Password must include at least one uppercase letter, one lowercase letter, and one number.'
        }
    },
    googleId: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['user'],
        default: 'user',
    },
    accountStatus: {
        type: String,
        enum: accountStatusEnum,
        default: 'active',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    failedLoginAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: {
        type: Date,
        default: null,
    },
    isUsernameCustomized: {
        type: Boolean,
        default: false,
    },
    properties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
    }],
}, 
{ timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ properties: 1 });
userSchema.index({ role: 1 });
userSchema.index({ accountStatus: 1 });    

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

// Method to update the last login time
userSchema.methods.updateLastLogin = async function() {
    this.lastLogin = new Date();
    await this.save();
};

// Method to handle failed login attempts and lockout mechanism
userSchema.methods.incrementFailedLogins = async function() {
    const MAX_ATTEMPTS = 5;
    this.failedLoginAttempts += 1;

    if (this.failedLoginAttempts >= MAX_ATTEMPTS) {
        this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock account for 30 minutes
    }

    await this.save();
};

// Method to reset failed login attempts after successful login
userSchema.methods.resetFailedLogins = async function() {
    this.failedLoginAttempts = 0;
    this.lockUntil = null;
    await this.save();
};

// Static method for login (handles both OAuth and local login)
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        // Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            throw new Error("Account is temporarily locked due to multiple failed login attempts.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Reset failed login attempts on successful login
            await user.resetFailedLogins();
            return user;
        } else {
            // Increment failed login attempts on unsuccessful login
            await user.incrementFailedLogins();
            throw new Error("Incorrect password");
        }
    }
    throw new Error("Incorrect email");
};

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model("User", userSchema);

export default User;
