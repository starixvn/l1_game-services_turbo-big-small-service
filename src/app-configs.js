export default {
    hostingPort: 5001,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://api.lumigame.com",
        authUrl: "http://auth.lumigame.com",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
        requestTimeout: 10000,
        placeBetTimeout: 4500,
        enableApiLogs: true,
    },
    userServiceSettings: {
        url: "https://l1-proxy.lumigame.com/user",
        requestTimeout: 10000,
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://localhost:27017",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auto_reconnect: true,
        },
    },
    sentry: {
        sentryUrl: "https://304fcee64d694a7ca7a0b15d9c8de27d@sentry.lumigame.com/9",
        logIdentifier: "turbo-big-small",
        env: "DEV",
    },
    authenticateSettings: {
        audiences: ["api", "admin-api"],
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    enableCorsWs: false,
    corsUrls: ["http://localhost:7456", "http://localhost:7000", "http://games.lumigame.com", "http://admin.lumigame.com"],
    enableMsgpackParser: false,
};
