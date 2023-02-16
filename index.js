const sequelize = require('sequelize')
const {Band} = require('./Band')
const {Musician} = require('./Musician')
const { Song } = require('./Song')

Musician.belongsTo(Band)
Band.hasMany(Musician)
Song.belongsToMany(Band, {through: "Song_Band"})
Band.belongsToMany(Song, {through: "Song_Band"})


module.exports = {
    Band,
    Song,
    Musician
};