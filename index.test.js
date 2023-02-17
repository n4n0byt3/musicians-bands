const { sequelize } = require('./db');
const { Band, Musician, Song } = require('./index')

describe('Band and Musician Models', () => {
  /**
   * Runs the code prior to all tests
   */
  beforeAll(async () => {
    // the 'sync' method will create tables based on the model class
    // by setting 'force:true' the tables are recreated each time the
    // test suite is run
    await sequelize.sync({ force: true });
  })

  test('can create a Band', async () => {
    let createdBand = await Band.create({
      name: "abc",
      genre: "xyz"
    })
    expect(createdBand.genre).toBe("xyz");
    expect(createdBand.name).toBe("abc");
  })

  test('can create a Musician', async () => {
    let createdMusician = await Musician.create({
      name: "abc",
      instrument: "xyz"
    })
    expect(createdMusician.instrument).toBe("xyz");
    expect(createdMusician.name).toBe("abc");
  })

  test('can update band', async () => {
    let createdBand = await Band.create({
      name: "abc",
      genre: "xyz"
    })
    let updatedBand = await createdBand.update({
      name: "cba",
      genre: "zyx"
    })
    expect(updatedBand.name).toBe("cba")
    expect(updatedBand.genre).toBe("zyx")
  })

  describe('Association', () => {
    beforeAll(async () => {
      await sequelize.sync({ force: true });
    });

    it('should create a band with a musician', async () => {
      const band = await Band.create({ name: 'Band 1' });
      const musician = await Musician.create({ name: 'Musician 1' });
      await musician.setBand(band);

      const result = await Band.findByPk(band.id, { include: Musician });
      expect(result.name).toBe('Band 1');
      expect(result.Musicians).toBeInstanceOf(Array);
      expect(result.Musicians).toHaveLength(1);
      expect(result.Musicians[0].name).toBe('Musician 1');
    });

    it('should create a band with a song', async () => {
      const band = await Band.create({ name: 'Band 2' });
      const song = await Song.create({ title: 'Song 1', year: 2022 });
      await band.addSong(song);

      const result = await Band.findByPk(band.id, { include: Song });
      expect(result.name).toBe('Band 2');
      expect(result.Songs).toBeInstanceOf(Array);
      expect(result.Songs).toHaveLength(1);
      expect(result.Songs[0].title).toBe('Song 1');
    });

    it('should create a song with multiple bands', async () => {
      const band1 = await Band.create({ name: 'Band 3' });
      const band2 = await Band.create({ name: 'Band 4' });
      const song = await Song.create({ title: 'Song 2', year: 2023 });
      await song.addBands([band1, band2]);

      const result = await Song.findByPk(song.id, { include: Band });
      expect(result.title).toBe('Song 2');
      expect(result.Bands).toBeInstanceOf(Array);
      expect(result.Bands).toHaveLength(2);
      expect(result.Bands[0].name).toBe('Band 3');
      expect(result.Bands[1].name).toBe('Band 4');
    });
  });
})