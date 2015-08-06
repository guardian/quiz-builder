function getConfig(env) {
    switch (env) {
        case 'production':
            return require('./application');
            break;
        case 'development':
            return require('./application.local');
            break;
        default:
            throw new Error("What env are you trying to run?");
    }
}

module.exports = {
    getConfig: getConfig
};
