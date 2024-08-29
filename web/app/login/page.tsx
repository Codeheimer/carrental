'use client';

import { useState } from "react";
import AlertError, { defaultErrorDetails, ErrorDetailsImpl } from "../components/alerts/alertError";
import { useRouter } from "next/navigation";
import Textbox, { TextboxDetails } from "../components/fields/textbox";
import GenericButton, { ButtonDetails } from "../components/fields/genericButton";

export default function LoginPage() {
    const router = useRouter();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(defaultErrorDetails);
    


    const attemptLogin = (event: React.FormEvent): void => {
        event.preventDefault();
        setError(defaultErrorDetails);
        console.log(login, password);


        //showError("Error", "Incorrect password!");
    }

    const showError = (title: string, description: string): void => {
        setError(new ErrorDetailsImpl(title, description));
    }

    const hasError = (): boolean => {
        return error.description.length > 0 && error.title.length > 0
    }

    const handleRegister = (): void => {
        router.push("/register")
    }


    const registerButton: ButtonDetails = {
        label: "Register",
        type: "button",
        onClickAction: handleRegister
    }

    const passwordField: TextboxDetails = {
        label: "Password",
        type: "password",
        name: "password",
        onChangeEvent: (e) => setPassword(e.target.value),
        isRequired: true
    }

    const emailField: TextboxDetails = {
        label: "Email",
        type: "text",
        name: "email",
        onChangeEvent: (e) => setLogin(e.target.value),
        isRequired: true
    }

    const loginButton: ButtonDetails = {
        label: "Login",
        type: "submit"
    }

    return (
        <div className="flex items-center flex-col border-2 m-6 border-solid border-green-50">
            <form onSubmit={attemptLogin}>
                <div className="flex items-center flex-col m-6">
                    {hasError() && <AlertError {...error} />}
                    <Textbox {...emailField} />
                    <Textbox {...passwordField} />
                    <div className="my-4">
                        <GenericButton {...loginButton} />
                        <GenericButton {...registerButton} />
                    </div>
                </div>
            </form>
        </div>
    )
}