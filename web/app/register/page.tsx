'use client';

import { ChangeEvent, useEffect, useRef, useState } from "react";
import AlertError, { defaultErrorDetails, ErrorDetailsImpl } from "../components/alerts/alertError";
import Dropdown, { DropdownDetails } from "../components/fields/dropdown";
import GenericButton, { ButtonDetails } from "../components/fields/genericButton";
import Textbox, { TextboxDetails } from "../components/fields/textbox";
import useGlobalServiceStore from "../stores/globalServiceStore";
import { useRouter } from "next/navigation";
import FileUpload from "../components/fields/fileUpload";
import Checkbox from "../components/fields/checkbox";

export interface RegistrationDetails {
}

export default function RegistrationPage() {
    const [error, setError] = useState(defaultErrorDetails);
    const alertError = useRef<HTMLDivElement>(null);
    const { registrationService } = useGlobalServiceStore();
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const [identification, setIdentification] = useState<File | null>(null);
    const [businessPermit, setBusinessPermit] = useState<File | null>(null);

    const [showBusinessPermitUpload, setShowBusinessPermitUpload] = useState<boolean>(false);

    useEffect(() => {
        if (error.hasError() && alertError.current) {
            alertError.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
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
            setError(new ErrorDetailsImpl("Error", "Password does not match."));
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
        
        registrationService.register(data).then((response) => {
            alert(response);
            formRef.current?.reset();
            router.push("/login");
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

    const toggleBusinessPermit = (e: ChangeEvent<HTMLInputElement>) => {
        setShowBusinessPermitUpload(!showBusinessPermitUpload);
    };

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
        ],
        addBlank: true
    }

    const address: TextboxDetails = {
        label: "Address",
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

    const identificationUpload: TextboxDetails = {
        label: "Upload ID",
        name: "identification",
        isRequired: true,
        onChangeEvent: handleIdentificationUpload
    }

    const businessPermitUpload: TextboxDetails = {
        label: "Upload Business Permit",
        name: "businessPermit",
        isRequired: true,
        onChangeEvent: handleBusinessPermitUpload
    }

    const checkboxBusinessPermit: TextboxDetails = {
        label: "is Owner?",
        name: "businessOwner",
        onChangeEvent: toggleBusinessPermit
    }

    const registerButton: ButtonDetails = {
        label: "Submit",
        type: "submit"
    }
    return (
        <form ref={formRef} onSubmit={register} className="flex justify-center items-center">
            <div className="flex justify-center items-center flex-col m-6 h-full w-3/4">
                <div>Register</div>
                {error.hasError() && <AlertError ref={alertError} {...error} />}
                <Textbox {...firstName} />
                <Textbox {...lastName} />
                <Textbox {...birthday} />
                <Dropdown {...gender} />
                <Textbox {...address} />
                <Textbox {...phone} />
                <hr className="border w-3/4 m-3 border-solid border-t-1 border-gray-300" />
                <Textbox {...email} />
                <Textbox {...password} />
                <Textbox {...passwordAgain} />

                <FileUpload {...identificationUpload} />
                <Checkbox {...checkboxBusinessPermit} />
                {showBusinessPermitUpload && <FileUpload {...businessPermitUpload} />}
                <div>
                    <GenericButton {...registerButton} />
                </div>

            </div>
        </form>)
}