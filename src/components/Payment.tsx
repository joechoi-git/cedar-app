"use client";

import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import ThemeSwitcher from "../components/ThemeSwitcher";
import Button from "../components/Button";

interface FormData {
    cardNumber: string;
    expiry: string;
    cvv: string;
    name: string;
    zip: string;
}

interface PaymentFormProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    onNext: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ formData, setFormData, onNext }) => {
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validate = () => {
        const newErrors: Partial<FormData> = {};
        if (!/^[0-9-]+$/.test(formData.cardNumber)) newErrors.cardNumber = "Invalid card number";
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry))
            newErrors.expiry = "Invalid expiry date";
        if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = "Invalid CVV";
        if (!formData.name) newErrors.name = "This field is required";
        if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) newErrors.zip = "Invalid ZIP code";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitted(true);
            setTimeout(onNext, 1000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6" aria-labelledby="payment-info">
            <h2 id="payment-info" className="font-bold text-xl mb-4 text-primary">
                1. Payment information
            </h2>
            <div className="mb-4">
                <label className="text-primary" htmlFor="cardNumber">
                    Card number
                </label>
                <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="1234-5678-1234-5678"
                    aria-invalid={!!errors.cardNumber}
                    aria-describedby="cardNumber-error"
                />
                {errors.cardNumber && (
                    <p id="cardNumber-error" className="text-error">
                        {errors.cardNumber}
                    </p>
                )}
                {isSubmitted && !errors.cardNumber && <p className="text-success">✔️</p>}
            </div>
            <div className="flex mb-4">
                <div className="flex-1 mr-2">
                    <label className="text-primary" htmlFor="expiry">
                        Expires (MM/YY)
                    </label>
                    <input
                        type="text"
                        id="expiry"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        placeholder="MM/YY"
                        aria-invalid={!!errors.expiry}
                        aria-describedby="expiry-error"
                    />
                    {errors.expiry && (
                        <p id="expiry-error" className="text-error">
                            {errors.expiry}
                        </p>
                    )}
                    {isSubmitted && !errors.expiry && <p className="text-success">✔️</p>}
                </div>
                <div className="flex-1 ml-2">
                    <label className="text-primary" htmlFor="cvv">
                        Security code (CVV)
                    </label>
                    <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        maxLength={4}
                        aria-invalid={!!errors.cvv}
                        aria-describedby="cvv-error"
                    />
                    {errors.cvv && (
                        <p id="cvv-error" className="text-error">
                            {errors.cvv}
                        </p>
                    )}
                    {isSubmitted && !errors.cvv && <p className="text-success">✔️</p>}
                </div>
            </div>
            <div className="mb-4">
                <label className="text-primary" htmlFor="name">
                    Name on card
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    aria-invalid={!!errors.name}
                    aria-describedby="name-error"
                />
                {errors.name && (
                    <p id="name-error" className="text-error">
                        {errors.name}
                    </p>
                )}
                {isSubmitted && !errors.name && <p className="text-success">✔️</p>}
            </div>
            <div className="mb-4">
                <label className="text-primary" htmlFor="zip">
                    ZIP code
                </label>
                <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="12345 or 12345-6789"
                    aria-invalid={!!errors.zip}
                    aria-describedby="zip-error"
                />
                {errors.zip && (
                    <p id="zip-error" className="text-error">
                        {errors.zip}
                    </p>
                )}
                {isSubmitted && !errors.zip && <p className="text-success">✔️</p>}
            </div>
            <Button type="submit" className="btn btn-secondary w-full">
                Continue
            </Button>
            <Button
                className="btn btn-neutral-400 w-full mt-4"
                onClick={(e: { preventDefault: () => void }) => {
                    e.preventDefault();
                    onNext();
                }}
            >
                Skip Validation
            </Button>
            <h2 className="mt-10 pt-4 border-t-2 border-neutral-400 font-bold text-xl mb-4 text-neutral-400">
                2. Review and pay
            </h2>
        </form>
    );
};

const Payment: React.FC = () => {
    const { theme } = useContext(ThemeContext);
    const [step, setStep] = useState<number>(0);
    const [animationClass, setAnimationClass] = useState<string>("");
    const [formData, setFormData] = useState<FormData>({
        cardNumber: "",
        expiry: "",
        cvv: "",
        name: "",
        zip: ""
    });

    const goToNextStep = () => {
        setAnimationClass("collapse-up");
        setTimeout(() => {
            setStep((prevStep) => prevStep + 1);
            setAnimationClass("expand-up");
        }, 500);
    };

    const goToPreviousStep = () => {
        setAnimationClass("collapse-up");
        setTimeout(() => {
            setStep((prevStep) => prevStep - 1);
            setAnimationClass("expand-up");
        }, 500);
    };

    return (
        <main className="min-h-screen bg-base-300 md:bg-base-100" data-theme={theme}>
            <header className="flex items-center gap-4 p-4 bg-base-300 shadow-none md:shadow-lg border-b-2 border-b-neutral-400 md:border-b-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 283 64"
                    width="150"
                    height="40"
                    className="text-primary"
                >
                    <path
                        fill="currentColor"
                        d="M141 16c-11 0-19 7-19 18s9 18 20 18c7 0 13-3 16-7l-7-5c-2 3-6 4-9 4-5 0-9-3-10-7h28v-3c0-11-8-18-19-18zm-9 15c1-4 4-7 9-7s8 3 9 7h-18zm117-15c-11 0-19 7-19 18s9 18 20 18c6 0 12-3 16-7l-8-5c-2 3-5 4-8 4-5 0-9-3-11-7h28l1-3c0-11-8-18-19-18zm-10 15c2-4 5-7 10-7s8 3 9 7h-19zm-39 3c0 6 4 10 10 10 4 0 7-2 9-5l8 5c-3 5-9 8-17 8-11 0-19-7-19-18s8-18 19-18c8 0 14 3 17 8l-8 5c-2-3-5-5-9-5-6 0-10 4-10 10zm83-29v46h-9V5h9zM37 0l37 64H0L37 0zm92 5-27 48L74 5h10l18 30 17-30h10zm59 12v10l-3-1c-6 0-10 4-10 10v15h-9V17h9v9c0-5 6-9 13-9z"
                    />
                </svg>
                <p className="text-xl font-bold text-primary">ABC Health System</p>
                <ThemeSwitcher />
            </header>
            <section className="flex justify-center items-center py-0 md:py-10">
                <div
                    className={`bg-base-300 rounded-none md:rounded-lg shadow-none md:shadow-2xl w-full max-w-full md:max-w-screen-md min-h-[500px] ${animationClass}`}
                >
                    {step === 0 && (
                        <>
                            <div className="p-6 pt-20 text-center bg-primary-content">
                                <p className="text-primary mb-4 text-3xl">Hi, Taylor</p>
                                <p className="text-secondary mb-4">
                                    You have 6 medical bills ready from ABC Health System. You can
                                    pay your bills here or verify your identity to view full bill
                                    details.
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center">
                                    <p className="text-secondary mb-6">Total due</p>
                                    <p className="text-primary mb-6 text-3xl">$600.00</p>
                                </div>
                                <Button onClick={goToNextStep} className="btn btn-secondary w-full">
                                    Pay total
                                </Button>
                            </div>
                        </>
                    )}
                    {step === 1 && (
                        <PaymentForm
                            formData={formData}
                            setFormData={setFormData}
                            onNext={goToNextStep}
                        />
                    )}
                    {step === 2 && (
                        <div className="p-6">
                            <h2 className="font-bold text-xl mb-4 text-neutral-400 flex justify-between items-center">
                                1. Payment information
                                <Button
                                    onClick={goToPreviousStep}
                                    className="ml-4 btn btn-secondary"
                                >
                                    Edit
                                </Button>
                            </h2>
                            <h2 className="mt-4 pt-4 border-t-2 border-neutral-400 font-bold text-xl mb-4 text-primary">
                                2. Review and pay
                            </h2>
                            <p className="text-primary">
                                You&apos;re about to make a payment of{" "}
                                <span className="font-bold">$600.00</span>
                            </p>
                            <p className="text-primary text-sm mt-2">Payment method</p>
                            <p className="text-primary text-sm mb-8">Card ending in ****4242</p>
                            <Button onClick={goToNextStep} className="btn btn-secondary w-full">
                                Pay $600.00
                            </Button>
                        </div>
                    )}
                    {step === 3 && (
                        <p className="p-6 pt-20 text-primary text-3xl w-full text-center">
                            Thank you for your payment!
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Payment;
