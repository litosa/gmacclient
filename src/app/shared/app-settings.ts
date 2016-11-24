export class AppSettings {

    public static get apiUrl(): string {
        var azureUrl = 'http://gmac-api.azurewebsites.net';
        var localUrl = 'http://localhost:1337';
        return azureUrl;
    }

    public static get clientUrl(): string {
        var localUrl = 'http://localhost:4200';
        return localUrl;
    }

    public static get authDomain(): string {
        return 'alcagroup.eu.auth0.com';
    }

    public static get clientId(): string {
        return 'BWJySS4YC58U9l0MnoqWIO2CIictpkG7';
    }
}