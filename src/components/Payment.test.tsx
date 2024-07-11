import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Payment from "./Payment";

describe("Payment Component", () => {
    const renderComponent = () => {
        return render(<Payment />);
    };

    it("renders initial step correctly", () => {
        renderComponent();
        expect(
            screen.getByText(
                /You can pay your bills here or verify your identity to view full bill details/i
            )
        ).toBeInTheDocument();
        expect(screen.getByText("Total due")).toBeInTheDocument();
        expect(screen.getByText("Pay total")).toBeInTheDocument();
    });

    it("navigates to payment form on button click", async () => {
        renderComponent();
        fireEvent.click(screen.getByText("Pay total"));

        await waitFor(() => expect(screen.getByLabelText("Card number")).toBeInTheDocument());
    });

    it("validates form fields and shows errors", async () => {
        renderComponent();
        fireEvent.click(screen.getByText("Pay total"));

        await waitFor(() => expect(screen.getByText("Continue")).toBeInTheDocument());

        fireEvent.click(screen.getByText("Continue"));

        await waitFor(() => {
            expect(screen.getByText("Invalid card number")).toBeInTheDocument();
            expect(screen.getByText("Invalid expiry date")).toBeInTheDocument();
            expect(screen.getByText("Invalid CVV")).toBeInTheDocument();
            expect(screen.getByText("This field is required")).toBeInTheDocument();
            expect(screen.getByText("Invalid ZIP code")).toBeInTheDocument();
        });
    });

    it("shows errors for incomplete form submission", async () => {
        renderComponent();
        fireEvent.click(screen.getByText("Pay total"));

        await waitFor(() => expect(screen.getByLabelText("Card number")).toBeInTheDocument());

        fireEvent.change(screen.getByLabelText("Card number"), {
            target: { value: "1234-5678-1234-5678" }
        });

        await waitFor(() => expect(screen.getByText("Continue")).toBeInTheDocument());

        fireEvent.click(screen.getByText("Continue"));

        await waitFor(() => {
            expect(screen.getByText("Invalid expiry date")).toBeInTheDocument();
            expect(screen.getByText("Invalid CVV")).toBeInTheDocument();
            expect(screen.getByText("This field is required")).toBeInTheDocument();
            expect(screen.getByText("Invalid ZIP code")).toBeInTheDocument();
        });
    });

    it("submits form with valid data", async () => {
        renderComponent();
        fireEvent.click(screen.getByText("Pay total"));

        await waitFor(() => expect(screen.getByLabelText("Card number")).toBeInTheDocument());

        fireEvent.change(screen.getByLabelText("Card number"), {
            target: { value: "1234-5678-1234-5678" }
        });
        fireEvent.change(screen.getByLabelText("Expires (MM/YY)"), { target: { value: "12/23" } });
        fireEvent.change(screen.getByLabelText("Security code (CVV)"), {
            target: { value: "123" }
        });
        fireEvent.change(screen.getByLabelText("Name on card"), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByLabelText("ZIP code"), { target: { value: "12345" } });

        await waitFor(() => expect(screen.getByText("Continue")).toBeInTheDocument());

        fireEvent.click(screen.getByText("Continue"));

        await waitFor(
            () => {
                expect(screen.getByText(/about to make a payment of/i)).toBeInTheDocument();
            },
            { timeout: 3000 }
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = renderComponent();
        expect(asFragment()).toMatchSnapshot();
    });
});
