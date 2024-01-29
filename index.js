document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('popup');
    const startButton = document.getElementById('startButton');

    startButton.addEventListener('click', function() {
        // Hide the popup when the "Start" button is clicked
        popup.style.display = 'none';
    });

    // Show the popup when the page loads
    popup.style.display = 'block';
});

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const boundaries = []
const offset = {
    x: -695,
    y: -200
}

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) 
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) 
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        })
})

const image = new Image();
image.src = './My Game Assets/Cozy Game.png';

const foregroundImage = new Image();
foregroundImage.src = './My Game Assets/foregroundObjects.png';

const playerDownImage = new Image();
playerDownImage.src = './My Game Assets/catDown.png';

const playerUpImage = new Image();
playerUpImage.src = './My Game Assets/catUp.png';

const playerRightImage = new Image();
playerRightImage.src = './My Game Assets/catRight.png';

const playerLeftImage = new Image();
playerLeftImage.src = './My Game Assets/catLeft.png';


const player = new Sprite({
    position: {
        x: canvas.width / 2 - 107 / 4 / 2,
        y: canvas.height / 2 - 26 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}


const movables = [background, ...boundaries, foreground, ...battleZones]

const renderables = [
    background,
    ...boundaries,
    foreground,
    ...battleZones,
    player,
    foreground
]

const battle = {
    initiated: false 
 }

function animate() {
    const animationId = window.requestAnimationFrame(animate)
    renderables.forEach((renderable) => {
        renderable.draw()
    })

    let moving = true
    player.animate = false

    if (battle.initiated) {
        return
    }


    // activate a battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea = 
            (Math.min(
                player.position.x + player.width, 
                battleZone.position.x + battleZone.width
                ) - 
                Math.max(player.position.x, battleZone.position.x)) *
            (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) 
            - Math.max(player.position.y, battleZone.position.y))
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: battleZone
            }) &&
            overlappingArea > (player.width * player.height) / 2
            && Math.random() < 0.01
            ) {
                //deactivate current animation loop
                window.cancelAnimationFrame(animationId)

                audio.Map.stop()
                audio.initBattle.play()
                audio.battle.play()
                battle.initiated = true
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                              //activate a new animation loop
                              initBattle()
                              animateBattle()  
                              gsap.to('#overlappingDiv', {
                                opacity: 0,
                                duration: 0.4
                              })
                            }
                        })   
                    }
                })
                break
            }
        }
    }

    if (keys.w.pressed && lastKey === 'w') { 
        player.animate = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                }}
            })) {
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.y += 3
        })
    } else if (keys.a.pressed && lastKey ===  'a') {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x + 3,
                    y: boundary.position.y
                }}
            })) {
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach(movable => {
            movable.position.x += 3
        })
    } else if (keys.s.pressed && lastKey === 's') {
        player.animate = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 3
                }}
            })) {
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.y -= 3
        })
    } else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x - 3,
                    y: boundary.position.y
                }}
            })) {
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.x -= 3
        })
    }
}
//animate()

let lastKey = ''

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
});

let clicked = false
addEventListener('click', () => {
  if (!clicked) {
    audio.Map.play()
    clicked = true
  }
})




