import React from 'react'
import { useState } from 'react'
import Step1 from '../ReportLibrary/Step1'
import Step2 from '../ReportLibrary/Step2'
import Step3 from '../ReportLibrary/Step3'
import Step4 from '../ReportLibrary/Step4'
const ReportPage = () => {
  const [activeStep, setActiveStep] = useState("1")
  const previousStep = (num) => {
    setActiveStep(num)
  }
  const nextStep = (num) => {
    setActiveStep(num)
  }
  return (
    <>
      {activeStep === "1" ?
        <Step1 next={() => nextStep("2")} /> : null}
      {activeStep === "2" ?
        <Step2 next={() => nextStep("3")} /> : null}
      {activeStep === "3" ?
        <Step3 prev={() => previousStep("2")} next={() => nextStep("4")} /> : null}
      {activeStep === "4" ?
        <Step4 prev={() => previousStep("3")} /> : null}
    </>
  )
}

export default ReportPage