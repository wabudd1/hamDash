export class Constants {
    public static readonly relevantWeatherZones: WeatherZone[] = [
        { name: "Buncombe", code: "NCZ053" },
        { name: "Henderson", code: "NCZ065" },
        { name: "Madison", code: "NCZ053" },
        { name: "Yancey", code: "NCZ053" },
        { name: "McDowell Mountains", code: "NCZ505" },
        { name: "Rutherford Mountains", code: "NCZ507" },
        { name: "Greater Rutherford", code: "NCZ508" },
        { name: "Polk Mountains", code: "NCZ509" },
        { name: "Eastern Polk", code: "NCZ510" },
        { name: "Haywood", code: "NCZ052" },
        { name: "Transylvania", code: "NCZ064" },
        { name: "Northern Jackson", code: "NCZ059" },
        { name: "Southern Jackson", code: "NCZ063" },
        { name: "Swain", code: "NCZ051" },
        { name: "Macon", code: "NCZ062" }
    ]
}

export interface WeatherZone {
    name: string;
    code: string;
}