const {Sequelize, sequelize} = require('./db');

let Song = sequelize.define("Song", {
    title: Sequelize.STRING,
    year: Sequelize.NUMBER
})

module.exports = {
    Song
};