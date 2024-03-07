module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const discordID = req.body.discordID
        if (!discordID) {
            res.status(403).json({error: 'Unauthorized'})
        }

        next()
    } catch (e) {
        res.status(403).json({error: 'Unauthorized'})
    }
}