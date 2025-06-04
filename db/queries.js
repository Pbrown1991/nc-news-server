const db = require('./connection')

const getAllUsers = () => {
    return db.query(`SELECT * from users;`).then(result => result.rows);
}
getAllUsers()
    .then(users => {
        console.log(users);
    })
    .catch(err => {
        console.log(err);
    })



const getTopicCoding = () => {
    return db.query(`SELECT * from articles WHERE topic = 'coding'`).then(result => result.rows);

}
getTopicCoding()
    .then(topics => {
        console.log(topics);
    })
    .catch(err => {
        console.log(err);
    })



const commentsLessThanZero = () => {
    return db.query(`SELECT * from comments WHERE votes < 0`).then(result => result.rows);
}    

commentsLessThanZero()
    .then(comments => {
        console.log(comments);
    })
    .catch(err => {
        console.log(err);
    })


    
const getAllTopics = () => {
    return db.query(`SELECT * from topics`).then(result => result.rows);
}
getAllTopics()
    .then(topics => {
    console.log(topics)
    })
    .catch(err => {
    console.log(err)
})



const getGrumpyArticles = () => {
    return db.query(`SELECT * from articles WHERE author ='grumpy19'`);
}

getGrumpyArticles()
    .then(articles => {
    console.log(articles)
    })
    .catch(err => {
    console.log(err)
})



const getSubTenComments = () => {
    return db.query(`SELECT * from comments WHERE votes > 10`);
}

getSubTenComments()
    .then(comments => {
    console.log(comments)
    })
    .catch(err => {
    console.log(err)
})
