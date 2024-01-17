const battleBackgroundImage = new Image()
battleBackgroundImage.src = './My Game Assets/battleBackground.png'
const battleBackground = new Sprite({position: {
    x: 0,
    y: 0
},
image: battleBackgroundImage
})

let greenCat
let peachCat
let renderedSprites
let battleAnimationId
let queue

function initBattle() {
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#userInterface').style.display = 'block'
    greenCat = new Monster(monsters.greenCat)
    peachCat = new Monster(monsters.peachCat)
    renderedSprites = [greenCat, peachCat]
    queue = []

    peachCat.attacks.forEach((attack) => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })

    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            peachCat.attack({
                attack: selectedAttack,
                recipient: greenCat,
                renderedSprites
            })
    
            if (greenCat.health <= 0) {
                queue.push(() => {
                    greenCat.faint()
                })
                queue.push(() => {
                    gsap.to('#overlappingDiv', {
                       opacity: 1,
                       onComplete: () => {
                        cancelAnimationFrame(battleAnimationId)
                        animate()
                        document.querySelector('#userInterface').style.display = 'none'
                        gsap.to('#overlappingDiv', {
                           opacity: 0
                        })
                       }
                    })
                })
            }
    
            const randomAttack = greenCat.attacks[Math.floor(Math.random() * greenCat.attacks.length)]
    
            queue.push(() => {
                greenCat.attack({
                    attack: randomAttack,
                    recipient: peachCat,
                    renderedSprites
                })
    
                if (peachCat.health <= 0) {
                    queue.push(() => {
                        peachCat.faint()
                    })
                }
            })
        })
    
        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = selectedAttack.type
            document.querySelector('#attackType').style.color = selectedAttack.color
        })
    })
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    console.log(battleAnimationId);

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

//animate()
initBattle()
animateBattle()

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
       queue[0]() 
       queue.shift()
    } else e.currentTarget.style.display = 'none'
})