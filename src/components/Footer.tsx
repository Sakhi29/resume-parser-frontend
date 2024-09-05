import React from "react";

function Footer() {
  return (
    <div className="pt-32">
      <section className="flex flex-col gap-5 justify-center items-center bg-primary w-full h-[400px]">
        <div className="uppercase text-gray-300">
          Upskill for a better future
        </div>
        <div className="text-3xl font-bold">Transform Your Resume with AI</div>
        <div className="">
          Utilize our advanced AI tools to build the perfect resume, analyze{" "}
          <br />
          your strengths, and prepare for interviews with confidence.
        </div>
        <div>
          <button className="bg-white text-black font-semibold rounded-full px-5 py-3">
            Get Started Now
          </button>
        </div>
        <div className="text-gray-300 text-sm">&#169;2024 CareerAI</div>
        <hr className="w-[75%] border-gray-300 border-1" />
        <div className="flex flex-row gap-5 mt-2">
          <div>Resume Builder</div>
          <div>Resume Parser</div>
          <div>Mock Interviews</div>
          <div>Contact Us</div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
