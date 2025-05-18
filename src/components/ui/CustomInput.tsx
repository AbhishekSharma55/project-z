import { useState } from 'react';

export const CustomInput = ({ placeholder, value, onChange }: { placeholder: string, value: string, onChange: (value: string) => void }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div>
            {/* Search input container */}
            < div
                id="poda"
                className="relative flex items-center justify-center"
                onMouseEnter={() => { }}
                onMouseLeave={() => { }}
            >
                {/* Glow effect */}
                < div className="absolute max-h-[130px] max-w-[354px] h-full w-full overflow-hidden blur-[30px] opacity-40 rounded-xl z-0" >
                    <div className={`absolute w-[999px] h-[999px] top-1/2 left-1/2 bg-no-repeat bg-[0_0] bg-[conic-gradient(#000,#402fb5_5%,#000_38%,#000_50%,#cf30aa_60%,#000_87%)] ${isFocused ? 'transition-all duration-[4000ms] -translate-x-1/2 -translate-y-1/2 rotate-[420deg]' : 'transition-all duration-[2000ms] -translate-x-1/2 -translate-y-1/2 rotate-[60deg] hover:-rotate-[120deg]'}`}></div>
                </div >

                {/* Dark border background */}
                < div className="absolute max-h-[65px] max-w-[312px] h-full w-full overflow-hidden z-0 rounded-xl" >
                    <div className={`absolute w-[600px] h-[600px] top-1/2 left-1/2 bg-no-repeat bg-[0_0] bg-[conic-gradient(rgba(0,0,0,0),#18116a,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#6e1b60,rgba(0,0,0,0)_60%)] ${isFocused ? 'transition-all duration-[4000ms] -translate-x-1/2 -translate-y-1/2 rotate-[442deg]' : 'transition-all duration-[2000ms] -translate-x-1/2 -translate-y-1/2 rotate-[82deg] hover:-rotate-[98deg]'}`}></div>
                </div >

                {/* White glow */}
                < div className="absolute max-h-[63px] max-w-[307px] h-full w-full overflow-hidden z-0 rounded-lg blur-[2px]" >
                    <div className={`absolute w-[600px] h-[600px] top-1/2 left-1/2 bg-no-repeat bg-[0_0] bg-[conic-gradient(rgba(0,0,0,0),#a099d8,rgba(0,0,0,0)_8%,rgba(0,0,0,0)_50%,#dfa2da,rgba(0,0,0,0)_58%)] brightness-[1.4] ${isFocused ? 'transition-all duration-[4000ms] -translate-x-1/2 -translate-y-1/2 rotate-[443deg]' : 'transition-all duration-[2000ms] -translate-x-1/2 -translate-y-1/2 rotate-[83deg] hover:-rotate-[97deg]'}`}></div>
                </div >

                {/* Border */}
                < div className="absolute max-h-[59px] max-w-[303px] h-full w-full overflow-hidden z-0 rounded-xl blur-[0.5px]" >
                    <div className={`absolute w-[600px] h-[600px] top-1/2 left-1/2 bg-no-repeat bg-[0_0] bg-[conic-gradient(#1c191c,#402fb5_5%,#1c191c_14%,#1c191c_50%,#cf30aa_60%,#1c191c_64%)] brightness-[1.3] ${isFocused ? 'transition-all duration-[4000ms] -translate-x-1/2 -translate-y-1/2 rotate-[430deg]' : 'transition-all duration-[2000ms] -translate-x-1/2 -translate-y-1/2 rotate-[70deg] hover:-rotate-[110deg]'}`}></div>
                </div >

                {/* Main input container */}
                < div id="main" className="relative" >
                    <input
                        placeholder={placeholder}
                        type="text"
                        name="text"
                        className="bg-[#010201] border-none w-[301px] h-[56px] rounded-lg text-white px-[59px] text-lg focus:outline-none"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />

                    {/* Input mask */}
                    {/* {
                        !isFocused && (
                            <div className="pointer-events-none w-[100px] h-[20px] absolute bg-gradient-to-r from-transparent to-black top-[18px] left-[70px]"></div>
                        )
                    } */}

                    {/* Pink mask */}
                    <div className={`pointer-events-none w-[30px] h-[20px] absolute bg-[#cf30aa] top-[10px] left-[5px] blur-[20px] opacity-80 transition-all duration-[2000ms] ${isFocused ? 'opacity-0' : ''}`}></div>
                </div>
            </div>
        </div>
    );
}