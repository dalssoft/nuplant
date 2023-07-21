const passport = require('passport')
const passportJwt = require('passport-jwt')
const User = require('../../domain/entities/user')
const findUser = require('../../domain/usecases/user/findUser')
const { logException } = require('../log/api')

// JWT token examples:
// OK: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyN2QyZDZmYy0wYTI2LTQ5NmEtYjk3Yi1lNDhkYWQyZWEyNWYifQ.5Qt_vosv98VuNmJ8WiI-UVoRcp-vq-KG9fGRqS8UySY
// Not found: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyN2QyZDZmYy0wYTI2LTQ5NmEtYjk3Yi1lNDhkYWQyZWEyNTEifQ.b7XqSLYOK2tw6HpQaqn27BvZ5Ss9rMIe0PYY8fQXYHU

async function auth(app, config) {

    async function findUserPermissions({ userId }, done) {
        let error = null
        try {
            const uc = findUser()
            await uc.authorize()
            const response = await uc.run({ id: userId })
            if (response.isOk) return done(null, response.ok)
        } catch (err) {
            error = err
        }
        logException({ error, endpoint: 'auth', transport: 'HTTP', user: { id: userId } })
        return done(error, false)
    }

    function authRequestHandler(req, res, next) {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (!err) {
                req.user =  user ? user : new User()
                return next()
            }
            logException({ error: err, endpoint: req.originalUrl, transport: 'HTTP' })
            return res.status(401).json({ error: err })
        })(req, res, next)
    }

    const { Strategy, ExtractJwt } = passportJwt
    const strategy = new Strategy({
        secretOrKey: config.api.auth.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }, findUserPermissions)

    passport.use(strategy)

    app.use(passport.initialize())

    app.use(authRequestHandler)
}

module.exports = { auth }
