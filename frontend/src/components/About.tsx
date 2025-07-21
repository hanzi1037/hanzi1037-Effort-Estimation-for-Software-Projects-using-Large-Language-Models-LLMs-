import React from "react";
import { Link } from "react-router-dom";
import aboutImg from "../assets/images/features/2.png"

import {FiCheckCircle, MdKeyboardArrowRight} from '../assets/icons/vander'

export default function AboutOne(){
    return(
        <>
        <div id="aboutus" className="container relative md:mt-24 mt-16">
            <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-6">
                <div className="relative overflow-hidden rounded-lg border border-amber-400/5 bg-gradient-to-tl to-amber-400/30  from-fuchsia-600/30 dark:to-amber-400/50 dark:from-fuchsia-600/50 ps-6 pt-6 lg:me-8">
                    <img src={aboutImg} className="ltr:rounded-tl-lg rtl:rounded-tr-lg" alt=""/>
                </div>

                <div className="">
                    <h3 className="mb-4 md:text-3xl md:leading-normal text-2xl leading-normal font-semibold">Estimate Software Effort in a Single <br/> Click With AI Power</h3>
                    <p className="text-slate-400 max-w-xl">“Effort estimation has always been a complex task — until now. Our intelligent system uses state-of-the-art language models and real-world data to generate fast, accurate, and explainable estimations like never before.”</p>

                    <ul className="list-none text-slate-400 mt-4">
                        <li className="mb-2 flex items-center"><FiCheckCircle className="text-amber-400 h-5 w-5 me-2"/>AI-Powered Software Effort Estimation</li>
                        <li className="mb-2 flex items-center"><FiCheckCircle className="text-amber-400 h-5 w-5 me-2"/>Built on Real Industry Data (ISBSG)</li>
                        <li className="mb-2 flex items-center"><FiCheckCircle className="text-amber-400 h-5 w-5 me-2"/>Explainable, Transparent, and Developer-Friendly</li>
                    </ul>
                </div>
            </div>
        </div>
        </>
    )
}