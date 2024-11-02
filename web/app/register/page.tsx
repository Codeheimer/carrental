'use client';

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Dropdown, { DropdownDetails } from "../components/fields/dropdown";
import GenericButton, { ButtonDetails } from "../components/fields/genericButton";
import Textbox, { TextboxDetails } from "../components/fields/textbox";
import useGlobalServiceStore from "../stores/globalServiceStore";
import { useRouter } from "next/navigation";
import FileUpload, { FileuploadDetails } from "../components/fields/fileUpload";
import Checkbox, { CheckboxDetails } from "../components/fields/checkbox";
import { LookUp } from "../services/utilityService";
import ErrorMessage, { ErrorDetails } from "../components/alerts/errorMessage";

export default function RegistrationPage() {
    const [error, setError] = useState<ErrorDetails | null>(null);
    const alertError = useRef<HTMLDivElement>(null);
    const { registrationService, utilityService } = useGlobalServiceStore();
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const [regions, setRegions] = useState<LookUp[]>([]);
    const [provinces, setProvinces] = useState<LookUp[]>([]);
    const [municipality, setMunicipality] = useState<LookUp[]>([]);
    const [barangay, setBarangay] = useState<LookUp[]>([]);

    const [identification, setIdentification] = useState<File | null>(null);
    const [businessPermit, setBusinessPermit] = useState<File | null>(null);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const [showBusinessPermitUpload, setShowBusinessPermitUpload] = useState<boolean>(false);

    const [selectedProvice, setSelectedProvince] = useState<string>('');
    const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');
    const [selectedBarangay, setSelectedBarangay] = useState<string>('');

    useEffect(() => {
        if (error && alertError.current) {
            alertError.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }

        const prepareRegionDropdown = async () => {
            const regions: LookUp[] = await utilityService.fetchAddressType('REGION');
            setRegions(regions);
        }

        prepareRegionDropdown();
    }, [error]);

    const register = (event: React.FormEvent): void => {
        event.preventDefault();
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

        if (jsonData.password !== jsonData.passwordAgain) {
            setError({ title: "Error", message: "Password does not match." });
            return;
        }

        jsonData['businessOwner'] = jsonData['businessOwner'] === 'on' ? true : false;

        const data = new FormData();

        data.append('registrationData', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }))
        if (identification) {
            console.log("adding identification")
            data.append('identification', identification);
        }
        if (showBusinessPermitUpload && businessPermit) {
            console.log("adding business Permit")
            data.append('businessPermit', businessPermit);
        }

        if (profilePicture) {
            data.append('profilePicture', profilePicture);
        }

        registrationService.register(data).then((response) => {
            alert(response.message);
            if (response.success) {
                formRef.current?.reset();
                router.push("/login");
            }
        }).catch(error => {
            alert(error);
        });

    };

    const handleIdentificationUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            console.log("GETTING FILE", e.target.files[0])
            setIdentification(e.target.files[0]);
        }
    };

    const handleBusinessPermitUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            console.log("GETTING FILE", e.target.files[0])
            setBusinessPermit(e.target.files[0]);
        }
    };

    const handleProfilePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            console.log("GETTING FILE", e.target.files[0])
            setProfilePicture(e.target.files[0]);
        }
    }

    const toggleBusinessPermit = (checked: boolean): void => {
        setShowBusinessPermitUpload(!checked);
    };

    const prepareAddressDropdown = async (parentValue: string, parentName: string, target: string, processOptions: (options: LookUp[]) => void) => {
        if (formRef.current) {
            const options: LookUp[] = await utilityService.fetchAddressType(target, parentName.toUpperCase(), parentValue);
            processOptions(options);
        }
    }

    const resetAddressFields = (triggerField: string) => {
        switch (triggerField) {
            case "region":
                setProvinces([]);
                setSelectedProvince('');
                resetMunicipality();
                resetBarangay();
                break;
            case "province":
                resetMunicipality();
                resetBarangay();
                break;
            case "municipality":
                resetBarangay();
            default:
                break;
        }
    }

    const resetMunicipality = () => {
        setMunicipality([]);
        setSelectedMunicipality('');
    }

    const resetBarangay = () => {
        setBarangay([]);
        setSelectedBarangay('');
    }

    const firstName: TextboxDetails = {
        label: "First Name",
        name: "firstName",
        isRequired: true
    };

    const lastName: TextboxDetails = {
        label: "Last Name",
        name: "lastName",
        isRequired: true
    }

    const birthday: TextboxDetails = {
        label: "Birthdate",
        type: "date",
        name: "birthdate",
        isRequired: true
    }

    const gender: DropdownDetails = {
        label: "Gender",
        name: "gender",
        options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" }
        ]
    }

    const regionDetails: DropdownDetails = {
        label: "Region",
        name: "region",
        options: [...regions.map(r => ({ value: r.value, label: r.value }))],
        onValueChange: (value) => {
            resetAddressFields("region");
            prepareAddressDropdown(value, 'region', 'PROVINCE', (options) => setProvinces(options));
        }
    }

    const provinceDetails: DropdownDetails = {
        label: "Province",
        name: "province",
        options: [...provinces.map(r => ({ value: r.value, label: r.value }))],
        onValueChange: (value) => {
            resetAddressFields("province");
            prepareAddressDropdown(value, 'province', 'MUNICIPALITY', (options) => setMunicipality(options));
            setSelectedProvince(value);
        },
        value: selectedProvice
    }

    const municipalityDetails: DropdownDetails = {
        label: "Municipality",
        name: "municipality",
        options: [...municipality.map(r => ({ value: r.value, label: r.value }))],
        onValueChange: (value) => {
            resetAddressFields("municipality");
            prepareAddressDropdown(value, 'municipality', 'BARANGAY', (options) => setBarangay(options));
            setSelectedMunicipality(value)
        },
        value: selectedMunicipality
    }

    const barangayDetails: DropdownDetails = {
        label: "Barangay",
        name: "barangay",
        options: [...barangay.map(r => ({ value: r.value, label: r.value }))],
        onValueChange: (value) => { setSelectedBarangay(value) },
        value: selectedBarangay
    }

    const address: TextboxDetails = {
        label: "Street Address",
        name: "address",
        isRequired: true
    }

    const phone: TextboxDetails = {
        label: "Phone Number",
        name: "phoneNumber",
        isRequired: true
    }

    const email: TextboxDetails = {
        label: "Email",
        name: "email",
        isRequired: true
    }

    const password: TextboxDetails = {
        label: "Password",
        type: "password",
        name: "password",
        isRequired: true
    }

    const passwordAgain: TextboxDetails = {
        label: "Re-type Password",
        type: "password",
        name: "passwordAgain",
        isRequired: true
    }

    const identificationUpload: FileuploadDetails = new FileuploadDetails("Upload ID", "identification", false, false, true, handleIdentificationUpload);

    const businessPermitUpload: FileuploadDetails = new FileuploadDetails("Upload Business Permit", "businessPermit", true, false, false, handleBusinessPermitUpload);

    const profileUpload: FileuploadDetails = new FileuploadDetails("Profile Picture", "profilePicture", true, false, false, handleProfilePictureUpload);

    const checkboxBusinessPermit: CheckboxDetails = {
        isRequired: false,
        isHidden: false,
        label: "is Owner?",
        name: "businessOwner",
        onChangeEvent: () => toggleBusinessPermit(showBusinessPermitUpload)
    }

    const registerButton: ButtonDetails = {
        label: "Submit",
        type: "submit"
    }
    return (
        <form ref={formRef} onSubmit={register} className="flex justify-center items-center">
            <div className="flex justify-center items-center flex-col m-6 h-full w-3/4">
                <div>Register</div>
                {error && <ErrorMessage ref={alertError} {...error} />}
                <Textbox {...firstName} />
                <Textbox {...lastName} />
                <Textbox {...birthday} />
                <Dropdown {...gender} />
                <hr className="border w-3/4 m-3 border-solid border-t-1 border-gray-300" />
                <Dropdown {...regionDetails} />
                <Dropdown {...provinceDetails} />
                <Dropdown {...municipalityDetails} />
                <Dropdown {...barangayDetails} />
                <Textbox {...address} />
                <Textbox {...phone} />
                <hr className="border w-3/4 m-3 border-solid border-t-1 border-gray-300" />
                <Textbox {...email} />
                <Textbox {...password} />
                <Textbox {...passwordAgain} />

                <FileUpload {...identificationUpload} />
                <Checkbox {...checkboxBusinessPermit} />
                {showBusinessPermitUpload && <FileUpload {...businessPermitUpload} />}

                <FileUpload {...profileUpload} />
                <div>
                    <GenericButton {...registerButton} />
                </div>

            </div>
        </form>)
}