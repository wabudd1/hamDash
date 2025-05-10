export interface IEpaUltraviolet {
    // https://data.epa.gov/efservice/getEnvirofactsUVDaily/ZIP/28806/JSON
    ZIP_CODE: number,
    CITY: string,
    STATE: string,
    UV_INDEX: number,
    UV_ALERT: number,
    DATE: string
}