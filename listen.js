const app = require('./app')



app.listen(1991, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('listening on 1991')
    }
})