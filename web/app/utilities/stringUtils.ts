const VEHICLE_AGE_DIVIDER = ":";

export const truncate = (text: string, length: number): string => {
    return text.length > length ? text.slice(0, length) + '...' : text;
}

export const beautifyVehicleAge = (ageStructure: string): string => {
    let age = "";
    if (ageStructure) {
        const splitted = ageStructure.split(VEHICLE_AGE_DIVIDER);
        const hours = splitted[0];
        const days = splitted[1];
        const months = splitted[2];

        if (months === "0") {
            if (days === "0") {
                if (hours === "0") {
                    age = '<1 hour ago'
                } else {
                    age = `${hours} hours ago`
                }
            } else {
                if (Number(days) === 1) {
                    age = `${days} day ago`
                } else {
                    age = `${days} days ago`
                }
            }
        } else {
            age = `${months} months ago`
        }
    }
    return age;
}