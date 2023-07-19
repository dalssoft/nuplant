function logOK({ uc, user, response, transport, endpoint, }) {
    const elapsedTime = uc?.auditTrail?.elapsedTime || 0n
    const errorMessages = response.isErr ? response?.err?.message || JSON.stringify(response?.err) : null
    console.info(
        response.isOk ? `😊` : `🥵`,
        uc.description,
        `\x1b[90m`,
        `(${elapsedTime / 1000000n}ms)`,
        `\n  👤`, user?.id,
        `\n  🔌`, endpoint, `(${transport})`,
        errorMessages ? `\n  💡 ${errorMessages}` : ``,
        `\x1b[0m`)
}

function logException({ uc, user, error, endpoint, transport }) {
    const usecaseInfo = uc?.description ? `${uc?.description}` : ``
    const userInfo = user?.id ? `\n  👤 ${user?.id}` : ``
    console.error(
        `🛑`, usecaseInfo, userInfo,
        `\n  🔌\x1b[90m`, endpoint, `(${transport})`, `\x1b[0m`, `\n`,
        ` ❌`,
        error)
}

module.exports = { logException, logOK }