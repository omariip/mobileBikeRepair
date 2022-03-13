/**
 * Code written by: Paulo Alves
 * Source: https://www.youtube.com/watch?v=85V74jdpqZ0&list=PLlyAM-8-I7S9iNcZRfP4SQJhm4Mw5q5ku&index=29
 * Edited by: Omar Abou Chaer
 */

export function findAddressNumber(addressComponents: {long_name: string, short_name: string, types: string[]}[]): string {
    return findAddressComponent(addressComponents, "street_number");
}

export function findCity(addressComponents: {long_name: string, short_name: string, types: string[]}[]): string {
    return findAddressComponent(addressComponents, "locality");
}

export function findNeighborhood(addressComponents: {long_name: string, short_name: string, types: string[]}[]): string {
    return findAddressComponent(addressComponents, "sublocality") || 
        findAddressComponent(addressComponents, "sublocality_level_1");
}

export function findState(addressComponents: {long_name: string, short_name: string, types: string[]}[]): string {
    return findAddressComponentShortName(addressComponents, "administrative_area_level_1");
}

export function findStateShortName(addressComponents: {long_name: string, short_name: string, types: string[]}[]): string {
    return findAddressComponentShortName(addressComponents, "administrative_area_level_1");
}

export function findStreet(addressComponents: {long_name: string, short_name: string, types: string[]}[]) : string {
    return findAddressComponent(addressComponents, "route");
}

export function findZipCode(addressComponents: {long_name: string, short_name: string, types: string[]}[]) : string {
    let element = ""
    addressComponents.forEach((a: any) => {
        let hasZipCode = a.types.some(t => t == "postal_code");
        if(hasZipCode) {
            element = a.long_name;
        }
    });
    return element;
}

export function findAddressComponent(
    addressComponents: {long_name: string, short_name: string, types: string[]}[],
    type: string
) : string {
    let element = addressComponents.find(a => a.types.some(t => t == type));
    return element ? element.long_name : '';
}

export function findAddressComponentShortName(
    addressComponents: {long_name: string, short_name: string, types: string[]}[],
    type: string
) : string {
    let element = addressComponents.find(a => a.types.some(t => t == type));
    return element ? element.short_name : '';
}