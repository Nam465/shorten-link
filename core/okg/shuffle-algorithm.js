
/* Fisher–Yates shuffle Algorithm */
function shuffle(data) {
    let n = data.length

    for (let i = n-1; i >= 0 ; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = data[i]
        data[i] = data[j]
        data[j] = temp 
    }

    return data
} 

module.exports = shuffle