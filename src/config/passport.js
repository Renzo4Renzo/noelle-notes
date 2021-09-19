const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "User not found!" });
        } else {
          const matchesPassword = await user.matchPassword(password);
          if (matchesPassword) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid Password!" });
          }
        }
      } catch (error) {
        let errorMessage = error.toString();
        if (error.name == "MongooseServerSelectionError" || error.name == "MongooseError") {
          errorMessage = "Can't establish connection with database! Try again later!";
        }
        return done(null, false, { message: errorMessage });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (error, user) => {
    done(error, user);
  });
});
