export interface UserModel {
    name?: string,
    email?: string,
    password?: string,
    admin?: boolean,
    lastRun? : Run,
    runs?: Run[]
}

export interface Run{
    distance: string,
    duration: string,
    date: string,
    speed: string,
    routeCoordinates: Coord[]
}

export interface Coord{
    latitude: string,
    longitude: string
}