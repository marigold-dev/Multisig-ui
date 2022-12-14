import { useContext, useEffect } from "react";
import FormContext from "../context/formContext";

function Stepper() {
    const activeStepIndex = useContext(FormContext)!.activeStepIndex;
    useEffect(() => {
        const stepperItems = document.querySelectorAll(".stepper-item");
        stepperItems.forEach((step, i) => {
            if (i <= activeStepIndex) {
                step.classList.add("bg-primary", "text-white");
            } else {
                step.classList.remove("bg-primary", "text-white");
            }
        });
    }, [activeStepIndex]);
    return (
        <div className="w-3/4 col-span-2  flex flex-row items-center justify-center md:px-32 md:py-16 justify-self-center">
            <div className="stepper-item w-8 h-8 text-gray-800 text-center font-medium border-2 ">
                1
            </div>
            <div className="flex-auto border-t-2"></div>
            <div className="stepper-item w-8 h-8 text-gray-800 text-center font-medium border-2 ">
                2
            </div>
            <div className="flex-auto border-t-2"></div>
            <div className="stepper-item w-8 h-8 text-gray-800 text-center font-medium border-2 ">
                3
            </div>
        </div>
    );
}

export default Stepper;
