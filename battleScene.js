
const battleBackgroundImage = new Image()
battleBackgroundImage.src = './My Game Assets/battleBackground.png'
const battleBackground = new Sprite({position: {
    x: 0,
    y: 0
},
image: battleBackgroundImage
})

const greenCatImage = new Image()
greenCatImage.src = './My Game Assets/greenCat.png'
const greenCat = new Sprite({
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
    name: 'Mochi'
})

const peachCatImage = new Image()
peachCatImage.src = './My Game Assets/peachCat.png'
const peachCat = new Sprite({
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
    isEnemy: true,
    name: 'Peaches'
})

const renderedSprites = [greenCat, peachCat]
function animateBattle() {
    window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

//animate()
animateBattle()

document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        peachCat.attack({
            attack: selectedAttack,
            recipient: greenCat,
            renderedSprites
        })
    })
});