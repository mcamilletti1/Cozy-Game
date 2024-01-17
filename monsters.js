const peachCatImage = new Image()
peachCatImage.src = './My Game Assets/peachCat.png'

const greenCatImage = new Image()
greenCatImage.src = './My Game Assets/greenCat.png'

const monsters = {
    peachCat: {
        position: {
            x: 300,
            y: 380
        },
        image: peachCatImage,
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Peaches',
        attacks: [attacks.Pounce, attacks.Hairball]
    },
    greenCat: {
        position: {
            x: 680,
            y: 230
        },
        image: greenCatImage,
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        isEnemy: true,
        name: 'Mochi',
        attacks: [attacks.Pounce, attacks.Hairball]
    }
}