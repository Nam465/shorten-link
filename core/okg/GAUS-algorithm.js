
/* GENERATE ALL UNIQUE STRING */
function GAUS(n, k, limit, skip) {

    let keys = []
    generate(n, k, '')
    return keys

    function generate(n, k, prefix) {

        if (k < 1) {
            if (skip > 0) {
                skip--
                return 
            }

            if (keys.length < limit) {
                keys.push(prefix)
            }

            return
        }

        for (let digit of n) {
            generate(n, k - 1, prefix + '' + digit)
        }
    }
}

module.exports = GAUS