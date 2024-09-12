export const generateJSONFromForm = (event: React.FormEvent): { [key: string]: any } => {
    const formData = new FormData(event.target as HTMLFormElement);
    const jsonData: { [key: string]: any } = {};
    formData.forEach((value, key) => {
        if (key !== 'identification' && key !== 'businessPermit') {
            jsonData[key] = value;
            if (key === 'birthdate') {
                jsonData[key] = new Date(value as string).toISOString();
            }
        }
    });
    return jsonData;
}