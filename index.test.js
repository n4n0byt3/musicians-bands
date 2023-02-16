const {sequelize} = require('./db');
const {Band, Musician, Song} = require('./index')

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
        let createdBand= await Band.create({
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

    describe('Musician and Band associations', () => {
    
    test('Band has many Musicians', async () => {
    const band = await Band.create({ name: 'The Rolling Stones' });
    
    const musician1 = await Musician.create({
      name: 'Mick Jagger',
      instrument: 'Vocals',
      BandId: band.id,
    });
    
    const musician2 = await Musician.create({
      name: 'Keith Richards',
      instrument: 'Guitar',
      BandId: band.id,
    });
    
    const fetchedBand = await band.reload();
    const musicians = await fetchedBand.getMusicians();
    expect(musicians.map((m) => m.name)).toContain('Mick Jagger');
    expect(musicians.map((m) => m.name)).toContain('Keith Richards');
  });

    test('Multiple songs can be added to a band', async () => {
        let band = await Band.create({
            name: "abc",
            genre: "xyz",
        })
        let createdSong = await Song.create({
            title: "abc",
            year: 12,
        })
        await band.addSong(createdSong)
        const fetchedBand = await band.reload();
        const songs = await fetchedBand.getSongs();
        expect(songs.map((s) => s.title)).toContain('abc')
    })
    test('Multiple bands can have the same song', async () => {
        let band = await Band.create({
            name: "abc",
            genre: "xyz",
        })
        let band1 = await Band.create({
            name: "bread",
            genre: "cheese",
        })
        let createdSong = await Song.create({
            title: "abc",
            year: 12,
        })
        await band.addSong(createdSong)
        await band1.addSong(createdSong)

        const fetchedBand = await band.reload();
        const fetchedBand1 = await band1.reload();

        const songs = await fetchedBand.getSongs();
        const songs1 = await fetchedBand1.getSongs();

        expect(songs.map((s) => s.title)).toContain('abc')
        expect(songs1.map((s) => s.title)).toContain('abc')
    })
    
    test('Find all muscians through band', async () => {
        //population
        let band1 = await Band.create({
            name: "abc",
            genre: "xyz",
        })
        let band2 = await Band.create({
            name: "bread",
            genre: "cheese",
        })

        // let musician1 = await Musician.create({
        //     name: "abcd"
        // })
        const expectedBands = [
            band1, band2,
          ];
    
          const foundBands = await Band.findAll({
            include: [{ model: Musician }],
            order: [['name', 'ASC']]
          });
          
    
          // Assert that arrays are equal
          expect(foundBands).toEqual(expectedBands);
        });
      });
    });