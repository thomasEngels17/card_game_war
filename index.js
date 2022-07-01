const cards_container = document.getElementById("cards-container")
const result_container = document.getElementById("result-container")
const card_values = ['2','3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE']
const deck_image_container = document.getElementById("deck-image-container")
const card_count_container = document.getElementById("card-count-container")
const scoreboard_container = document.getElementById("scoreboard-container")
const draw_two_btn = document.getElementById("draw-two-btn")
console.log(result_container)
console.log(cards_container)

let card1 = null
let card2 = null
let card_count = null
let deckID = null
let round_result = null
let player_one_score = 0
let player_two_score = 0

let tie_count = 1;

const options = {
    method: "GET"
}

function getNewDeck(){
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/?deck_count=1", options)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            deckID = data.deck_id
            card_count = data.remaining
            displayCardCount(card_count, player_one_score, player_two_score)
        })
}

function displayCardCount(card_count, player_one_score, player_two_score){
    card_count_container.innerHTML = 
    `<h2>Cards Remaining: ${card_count}</h2>`
    if (card_count == 0){
        if (player_one_score > player_two_score){
            result_container.innerHTML =
            `Player 2 Won`
        }
        else if (player_one_score < player_two_score){
            result_container.innerHTML =
            `Player 1 Won`
        }
        else {
            result_container.innerHTML =
            `It's a tie! :(`
        }
    }
}

function drawTwoCards(){
    if (deckID){
        fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckID}/draw/?count=2`, options)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            card1 = data.cards[0]
            card2 = data.cards[1]
            card_count = data.remaining
            cards_container.children[1].innerHTML = `<img src=${card1.image}>`
            cards_container.children[0].innerHTML = `<img src=${card2.image}>`
            result = determineHigherCard(card1, card2)
            result_container.innerHTML = `<h2>${result} wins</h2>`
            displayCardCount(card_count, player_one_score, player_two_score)
            setScore(player_one_score, player_two_score);
            if (card_count == 0){
                draw_two_btn.disabled = true
            }
        })
    } 
    else {
        alert("You need a deck first. Click the button in the top left.")
    }
}

function determineHigherCard(card1, card2){
    const card1_index = card_values.indexOf(card1.value)
    const card2_index = card_values.indexOf(card2.value)
    
    let increment = 2
    if (tie_count > 1) {
        increment = increment * tie_count
    }

    if (card1_index > card2_index){
        //increment player 1 score by 2
        player_one_score += increment
        tie_count = 1
        return card1.code
    }
    else if (card1_index < card2_index){
        //increment player 2 score by 2
        player_two_score += increment
        tie_count = 1
        return card2.code
    }
    else {
        tie_count += 1
        return 'Tie!'
    }
    
}

function setScore(player_one_score, player_two_score){
    scoreboard_container.innerHTML = 
    `<h2>Scoreboard </h2>
    <h2 id="player-one">Player 1: ${player_two_score}</h2>
    <h2 id="player-two">Player 2: ${player_one_score}</h2>`
}

document.getElementById("new-deck-btn").addEventListener("click", getNewDeck)
document.getElementById("draw-two-btn").addEventListener("click", drawTwoCards)
document.getElementById("reset-game-btn").addEventListener("click", function(){
    location.reload()
})

