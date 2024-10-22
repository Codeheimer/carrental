export interface ResourceDetails {
    resource: Blob,
    type: string
}

export const createObjectURL = (resourceDetails: ResourceDetails): string => {
    return URL.createObjectURL(new Blob([resourceDetails.resource], { type: resourceDetails.type }));
}