module.exports = (err) => {
    return err.message.split(': ').slice(1).join(':').split(', ')[0].split(':')[1];
}