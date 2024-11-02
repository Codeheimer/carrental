'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Textbox, { TextboxDetails } from "../components/fields/textbox";
import GenericButton, { ButtonDetails } from "../components/fields/genericButton";
import useGlobalServiceStore from "../stores/globalServiceStore";
import useAuthStore from "../stores/authStore";
import ErrorMessage, { ErrorDetails } from "../components/alerts/errorMessage";
import { LoginCredentials } from "../services/authenticationService";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<ErrorDetails | null>();
    const { authenticationService } = useGlobalServiceStore();
    const { login } = useAuthStore();

    const attemptLogin = (event: React.FormEvent): void => {
        event.preventDefault();
        setError(null);
        authenticationService.generateToken({ email, password } as LoginCredentials)
            .then((response) => {
                const token = response.token;
                authenticationService.saveToken(token);
                login(authenticationService.getToken(), response.id, response.roles, response.admin, response.displayName);
                router.push("/")
            }).catch((error) => {
                showError("Login Failed", error.message);
            });
    }

    const showError = (title: string, description: string): void => {
        setError({ title: title, message: description } as ErrorDetails);
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
        onChangeEvent: (e) => setEmail(e.target.value),
        isRequired: true
    }

    const loginButton: ButtonDetails = {
        label: "Login",
        type: "submit"
    }

    return (
        <div className="flex items-center flex-col border-1 m-6 border-solid border-gray-600">
            <form onSubmit={attemptLogin}>
                <div className="flex items-center flex-col m-6">
                    {error && <ErrorMessage {...error} />}
                    <Textbox {...emailField} />
                    <Textbox {...passwordField} />
                    <div className="my-4 flex flex-row">
                        <GenericButton {...loginButton} />
                        <GenericButton {...registerButton} />
                    </div>
                </div>
            </form>
        </div>
    )
}