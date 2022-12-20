import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { AppStateContext } from "../context/state";
import ContractLoader from "./contractLoader";

function TopUp(props: { address: string; closeModal: () => void }) {
    const state = useContext(AppStateContext)!;
    let [loading, setLoading] = useState(false);
    let [result, setResult] = useState("");
    const renderError = (message: string) => (
        <p className="italic text-red-600">{message}</p>
    );
    async function transfer(amount: number) {
        let op = await state.connection.wallet
            .transfer({ to: props.address, amount, mutez: true })
            .send();
        await op.confirmation(1);
    }

    if (loading && result === "") {
        return <ContractLoader loading={loading}></ContractLoader>;
    }
    if (!loading && result !== "") {
        return (
            <div className="flex justify-between items-center w-full md:h-12">
                <ContractLoader loading={loading}>
                    <span className="text-sm md:text-xl my-auto text-gray-800 font-bold">{result}</span>
                    <button
                        onClick={() => {
                            props.closeModal();
                        }}
                        type="button"
                        className=" bg-primary p-1 md:px-2 text-gray-200 hover:text-white focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </ContractLoader>
            </div>
        );
    }
    return (
        <Formik
            initialValues={{
                amount: 0,
            }}
            validate={(values) => {
                if (isNaN(values.amount)) {
                    return { amount: `not a valid amount ${values.amount}` };
                } else {
                    return;
                }
            }}
            onSubmit={async (values) => {
                setLoading(true);
                try {
                    await transfer(values.amount);
                    setResult("Transfer successfull");
                } catch {
                    setResult("Failed to transfer mutez");
                }
                setLoading(false);
            }}
        >
            <Form className="flex flex-col justify-center items-center  col-span-2 h-full">
                <div className="text-2xl font-medium  mb-2 text-gray-800 self-start">
                    Enter the amount you want to transfer below:
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between mb-2 w-full ">
                    <label className="font-medium text-gray-900">
                        Amount of mutez to transfer
                    </label>
                    <Field
                        name="amount"
                        className="rounded-md border-2 p-2"
                        placeholder="0"
                    />
                </div>
                <ErrorMessage name="amount" render={renderError} />
                <div className="flex justify-between w-2/3 md:w-1/3">
                    <button
                        className=" bg-primary font-medium text-white my-2 p-2 hover:bg-red-500 focus:bg-red-500 hover:outline-none border-2 hover:border-gray-800  hover:border-offset-2  hover:border-offset-gray-800"
                        onClick={e => {
                            e.preventDefault()
                            props.closeModal()
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className=" bg-primary font-medium text-white my-2 p-2 hover:bg-red-500 focus:bg-red-500 hover:outline-none border-2 hover:border-gray-800  hover:border-offset-2  hover:border-offset-gray-800"
                        type="submit"
                    >
                        Top up
                    </button>
                </div>
            </Form>
        </Formik>
    );
}

export default TopUp;
