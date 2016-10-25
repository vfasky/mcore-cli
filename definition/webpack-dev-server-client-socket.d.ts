interface socketArgs {
    (path: string, data: any): void
}

declare module 'webpack-dev-server/client/socket' {
    export = socket
}

declare var socket: socketArgs