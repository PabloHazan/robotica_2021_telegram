import axios, { AxiosResponse } from "axios";
import { Telegraf } from "telegraf";
import { createSmartScene } from "../framework/telegraf.scenes";
import { GPSLocation } from "../framework/telegraf.utils";

interface Province {
    ID: string;
    LocalizedName: string;
    EnglishName: string;
    Level: number;
    LocalizedType: string;
    EnglishType: string;
    CountryID: string;
}

interface Localidad {
    Version: number,
    Key: string,
    Type: string,
    Rank: number,
    LocalizedName: string,
    EnglishName: string,
    PrimaryPostalCode: string,
    Region: {
        ID: string,
        LocalizedName: string,
        EnglishName: string
    },
    Country: {
        ID: string,
        LocalizedName: string,
        EnglishName: string
    },
    AdministrativeArea: {
        ID: string,
        LocalizedName: string,
        EnglishName: string,
        Level: number,
        LocalizedType: string,
        EnglishType: string,
        CountryID: string
    },
    TimeZone: {
        Code: string,
        Name: string,
        GmtOffset: number
        IsDaylightSaving: boolean,
        NextOffsetChange: any
    },
    GeoPosition: {
        Latitude: number,
        Longitude: number,
        Elevation: {
            Metric: {
                Value: number,
                Unit: string,
                UnitType: number
            },
            Imperial: {
                Value: number,
                Unit: string,
                UnitType: number
            }
        }
    },
    IsAlias: boolean,
    SupplementalAdminAreas: Array<any>,
    DataSets: Array<string>
}

interface Clima {
    Headline: {
        EffectiveDate: string
        EffectiveEpochDate: number;
        Severity: number;
        Text: string
        Category: string
        EndDate: string
        EndEpochDate: number;
        MobileLink: string
        Link: string
    };
    DailyForecasts: [
        {
            Date: string
            EpochDate: number;
            Temperature: {
                Minimum: {
                    Value: number;
                    Unit: string
                    UnitType: number
                };
                Maximum: {
                    Value: number;
                    Unit: string
                    UnitType: number
                }
            };
            Day: {
                Icon: number;
                IconPhrase: string
                HasPrecipitation: boolean
            };
            Night: {
                Icon: number;
                IconPhrase: string
                HasPrecipitation: boolean;
                PrecipitationType: string
                PrecipitationIntensity: string
            };
            Sources: Array<string>;
            MobileLink: string
        }
    ]
}

interface ClimaState {
    provinces: Array<Province>;
    provinceId: string
}

const farenheitToCelsius = (farenheit: number): number => {
    const celsius: number = (farenheit - 32) * 5 / 9
    return Math.round(celsius * 100) / 100;
}

const accuWeatherClient = axios.create({
    baseURL: 'http://dataservice.accuweather.com/'
});

const msDay: number = 1000 * 60 * 60 * 24;

let provincesCache: Array<Province> | undefined = undefined;
const getProvinces = async (): Promise<Array<Province>> => {
    if (provincesCache === undefined) {
        const response = await accuWeatherClient.get<Array<Province>>(`locations/v1/adminareas/AR?apikey=${process.env.CLIMA_API_KEY}`);
        provincesCache = response.data;
        setTimeout(() => {
            provincesCache = undefined;
        }, msDay);
    }
    return provincesCache;
}

let localidadesCache: { [key: string]: Localidad | undefined } = {};
const crearLocalidadKey = (provinceId: string, name: string) => {
    return `${provinceId},${name}`;
}

const getLocalidad = async (provinceId: string, name: string): Promise<Localidad> => {
    const key: string = crearLocalidadKey(provinceId, name);
    if (!Object.keys(localidadesCache).includes(key)) {
        const response = await accuWeatherClient.get<Array<Localidad>>(`locations/v1/cities/AR/${provinceId}/search?apikey=${process.env.CLIMA_API_KEY}&q=${name}`)
        localidadesCache[key] = response.data.find(f => f.LocalizedName.toLocaleLowerCase() === name.toLocaleLowerCase());
        setTimeout(() => {
            delete localidadesCache[key];
        }, msDay);
    }
    const localidad: Localidad | undefined = localidadesCache[key];
    if (localidad === undefined) {
        throw 'La localidad no existe, proba con una que si, imbécil';
    } else {
        return localidad;
    }
}

const getForecastFromLocalidad = async (localidad: Localidad): Promise<string> => {
    const responseForecasts = await accuWeatherClient.get<Clima>(`forecasts/v1/daily/1day/${localidad.Key}?apikey=G9hIsAo2Fj8UiSuCGaiaESyESXmjHcEC&language=es-ar`);
    const forecast: Clima = responseForecasts.data;
    return `
El pronostico para ${localidad.LocalizedName} es: ${forecast.Headline.Text}
Temperatura minima: ${farenheitToCelsius(forecast.DailyForecasts[0].Temperature.Minimum.Value)}ºC
Temperatura maxima: ${farenheitToCelsius(forecast.DailyForecasts[0].Temperature.Maximum.Value)}ºC
Temperatura promedio: ${farenheitToCelsius((forecast.DailyForecasts[0].Temperature.Maximum.Value + forecast.DailyForecasts[0].Temperature.Minimum.Value) / 2)}ºC
    `;
}

export const clima = (bot: Telegraf) => createSmartScene<ClimaState>(
    bot,
    ['clima', 'Clima'],
    ({ setState, sendMessage }) => {
        setState({
            provinces: [],
            provinceId: ''
        });
        sendMessage('¿Como queres saber el clima?', {
            options: ['Preguntas'],
            useLocation: true
        })
    },
    async ({ sendMessage, state, getLocationFromMessage, isLocationMessage }) => {
        if (isLocationMessage()) {
            const location: GPSLocation = getLocationFromMessage();
            const response: AxiosResponse<Localidad> = await accuWeatherClient.get<Localidad>(`locations/v1/cities/geoposition/search?apikey=${process.env.CLIMA_API_KEY}&q=${location.latitude},${location.longitude}`);
            const localidad: Localidad = response.data;
            const respuesta: string = await getForecastFromLocalidad(localidad);
            sendMessage(respuesta);
            return 'end';
        } else {
            const provinces: Array<Province> = await getProvinces();
            state.provinces = provinces;
            sendMessage('¿En que provincia estas?', { options: provinces.map(province => province.LocalizedName) })
        }
    },
    ({ state, sendMessage, getTextFromMessage }) => {
        const provinceName = getTextFromMessage();
        const province: Province = state.provinces.find(province => province.LocalizedName === provinceName)!;
        state.provinceId = province.ID;
        sendMessage('¿En qué ciudad estas?');
    },
    async ({ state, sendMessage, getTextFromMessage }) => {
        try {
            const nombreLocalidad: string = getTextFromMessage();
            const localidad: Localidad = await getLocalidad(state.provinceId, nombreLocalidad);
            const respuesta: string = await getForecastFromLocalidad(localidad);
            sendMessage(respuesta);
        } catch (error) {
            sendMessage(error as string);
            return 'repeat';
        }
    }
)