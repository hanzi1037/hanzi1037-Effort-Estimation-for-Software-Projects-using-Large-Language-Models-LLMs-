import React from "react";
import { Link } from "react-router-dom";

export default function AmazingFeatures(){
    const featureData = [
        {
            icon:"mdi mdi-brain",
            title:'Context-Aware Estimation',
            desc:'Leverages relevant historical project data through RAG to provide contextually accurate effort predictions — no guessing, just relevant evidence.'
        },
        {
            icon:"mdi mdi-file-code-outline",
            title:'Structured Input Parsing',
            desc:'Automatically extracts and understands requirement specifications from uploaded documents (SRS, PDFs), mapping them to estimation-relevant parameters.'
        },
        {
            icon:"mdi mdi-comment-eye-outline",
            title:'Explainable Outputs',
            desc:'Every estimation includes a traceable reasoning path — so developers and stakeholders can see why a certain estimate was made.'
        },
    ]
    return(
        <>
        <div id="features" className="container relative md:mt-24 mt-16">
                <div className="grid grid-cols-1 pb-6 text-center">
                    <h3 className="mb-4 md:text-3xl md:leading-normal text-2xl leading-normal font-semibold">Powerful Features</h3>

                    <p className="text-slate-400 max-w-xl mx-auto">Effort estimation made precise, explainable, and fast — powered by a blend of Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG). Explore what sets our system apart:</p>
                </div>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
                    {featureData.map((item, index) =>{
                        return(
                            <div className="px-6 py-10 shadow hover:shadow-md dark:shadow-gray-800 dark:hover:shadow-gray-700 duration-500 rounded-lg bg-white dark:bg-slate-900" key={index}>
                                <i className={`${item.icon} text-4xl bg-gradient-to-tl to-amber-400 from-fuchsia-600 text-transparent bg-clip-text`}></i>
        
                                <div className="content mt-7">
                                    <Link to="" className="title h5 text-lg font-medium hover:text-amber-400 duration-500">{item.title}</Link>
                                    <p className="text-slate-400 mt-3">{item.desc}</p>
                                    
                                    {/* <div className="mt-5">
                                        <Link to="" className="hover:text-amber-400 font-medium duration-500">Read More <i className="mdi mdi-arrow-right align-middle"></i></Link>
                                    </div> */}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}