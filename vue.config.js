module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? (process.env.PUBLICPATH ? process.env.PUBLICPATH : '/') : '/'
}