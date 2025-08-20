const appConfig = () => {

    return {
        hashLength: 10,
        appVersion: "v1",
        maxApiCalls:10,
        maxApiCallsTime: 1 * 60 * 1000
    }
}

module.exports = appConfig;