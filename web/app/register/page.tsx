'use client';

import { useEffect, useRef, useState } from "react";
import AlertError, { defaultErrorDetails, ErrorDetailsImpl } from "../components/alerts/alertError";
import Dropdown, { DropdownDetails } from "../components/fields/dropdown";
import GenericButton, { ButtonDetails } from "../components/fields/genericButton";
import Textbox, { TextboxDetails } from "../components/fields/textbox";
import useGlobalServiceStore from "../stores/globalServiceStore";
import { useRouter } from "next/navigation";

export interface RegistrationDetails {
    firstName: string
}

export default function RegistrationPage() {
    const [error, setError] = useState(defaultErrorDetails);
    const alertError = useRef<HTMLDivElement>(null);
    const { registrationService } = useGlobalServiceStore();
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

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

        //console.log(formData);
        formData.forEach((value, key) => {
            jsonData[key] = value;
            if (key === 'birthdate') {
                jsonData[key] = new Date(value as string).toISOString();
            }
        });
        //console.log(JSON.stringify(jsonData));

        if (jsonData.password !== jsonData.passwordAgain) {
            setError(new ErrorDetailsImpl("Error", "Password does not match."));
            return;
        }

        jsonData['roles'] = "ROLE_USER"
        registrationService.register(jsonData as RegistrationDetails).then((response) => {
            alert(response);
            formRef.current?.reset();
            router.push("/login");
        }).catch(error => {
            alert(error);
        });
    };

    const firstName: TextboxDetails = {
        label: "First Name",
        type: "text",
        name: "firstName",
        isRequired: true
    };

    const lastName: TextboxDetails = {
        label: "Last Name",
        type: "text",
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
        type: "text",
        name: "address",
        isRequired: true
    }

    const phone: TextboxDetails = {
        label: "Phone Number",
        type: "text",
        name: "phoneNumber",
        isRequired: true
    }

    const email: TextboxDetails = {
        label: "Email",
        type: "text",
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
                <div>
                    <GenericButton {...registerButton} />
                </div>

            </div>
        </form>)
}