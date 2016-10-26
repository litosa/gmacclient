export class AppSettings {

    public static get apiUrl(): string {
        // var localUrl = 'http://localhost:3000/api';
        var apiUrl = 'http://gmacapi.azurewebsites.net/api';
        // return localUrl;
        return apiUrl;
    }

    public static get clientUrl(): string {
        // var localUrl = 'http://localhost:4200';
        // return localUrl;
        var localUrl = 'http://gmacclient.azurewebsites.net';
        return localUrl;
    }

    public static get authDomain(): string {
        return 'alcagroup.eu.auth0.com';
    }

    public static get clientId(): string {
        return 'BWJySS4YC58U9l0MnoqWIO2CIictpkG7';
    }
}