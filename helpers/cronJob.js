const cron = require('node-cron'),
    kue = require('kue'),
    queue = kue.createQueue(),
    mailer = require('./nodeMailer'),
    Question = require('../models/question');

function schedule() {
    // Saturday 07.00
    cron.schedule('00 07 * * 6', () => {
        Question.find().populate('userID')
            .then(questions => {
                questions.forEach(e => {
                    let text = `
                    Hi, ${e.userID.username}
                    <br>About your question for 
                    <br>${e.title}
                    <br>Description:
                    <br>${e.description}
                    <br>has been upvoted ${e.upvotes.length} time(s) and downvoted ${e.downvotes.length} time(s)
                    <br>Have a nice Weekend :)`

                    console.log(e.userID.email);
                    queue
                        .create('email', { email: e.userID.email, text })
                        .save()
                })
            })
            .catch(err => {
                console.log(err);
            })

        queue.process('email', function (job, done) {
            mailer(job.data.email, job.data.text)
            done()
        })
    })
}

module.exports = schedule;