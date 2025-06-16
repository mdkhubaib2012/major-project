module.exports = (fn) => {
    return (res, req, next, err) => {
        fn(req, res, next).catch(err)
    }
}