import classNames from "classnames";
import { Poppins, Urbanist } from "next/font/google";


const poppins = Poppins({
    subsets: ["latin"],
    weight: ['300', '400'],
    display: 'swap',
    style: 'normal',
    variable: '--font-secondary'
});

const urbanist = Urbanist({
    subsets: ["latin"],
    weight: ['900'],
    display: 'swap',
    style: 'normal',
    variable: '--font-primary',
});



export const fontsVariables = classNames(urbanist.variable, poppins.variable) 
