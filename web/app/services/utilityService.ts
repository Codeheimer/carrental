import { BaseService } from "./baseService";

export interface LookUp {
    value: string
}

export interface UtilityService {
    fetchAddressType: (type: string, parentType?: string, parent?: string) => Promise<LookUp[]>
}

export class UtilityServiceImpl extends BaseService implements UtilityService {
    public fetchAddressType = async (type: string, parentType?: string, parent?: string): Promise<LookUp[]> => {
        console.log(`values [${type},${parentType},${parent}]`)
        const URL = `${this.getBaseURL()}/ui/address-lookup/${(parent !== undefined && parentType !== undefined) ? `${parentType}/${parent}/` : ''}${type}`;

        const response = await this.doRequest<LookUp[]>(URL, {
            method: 'GET',
            headers: this.getHeaders()
        });

        return response;
    }
}