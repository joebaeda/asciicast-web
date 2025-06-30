import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="flex flex-col md:flex-row md:justify-between justify-center items-center">
            {/* Left Section: Copyright Info */}
            <div className="p-2 md:p-4">
                <span className="text-sm text-gray-600">
                    build with <span className="font-extrabold text-red-800">❤</span> by{" "}
                    <a
                        href="https://farcaster.xyz/asciicast"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-green-500"
                    >
                        asciicast
                    </a>
                </span>
            </div>

            {/* Right Section: Social Links */}
            <div className="flex p-2 md:p-4 space-x-4">
                

                {/* Basescan */}
                <a
                    href="https://basescan.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-500"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 155 154" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32.856 73.722a6.495 6.495 0 0 1 6.526-6.495l10.82.036a6.505 6.505 0 0 1 6.505 6.504v40.913c1.218-.361 2.783-.747 4.495-1.15a5.42 5.42 0 0 0 4.178-5.274v-50.75a6.506 6.506 0 0 1 6.505-6.507h10.841a6.507 6.507 0 0 1 6.505 6.506v47.102s2.714-1.098 5.358-2.214a5.43 5.43 0 0 0 3.316-4.998V41.244a6.505 6.505 0 0 1 6.503-6.505h10.842a6.503 6.503 0 0 1 6.505 6.505v46.24c9.399-6.813 18.924-15.005 26.483-24.857a10.93 10.93 0 0 0 1.662-10.193A76.58 76.58 0 0 0 76.662 1.005a76.57 76.57 0 0 0-65.488 114.706 9.69 9.69 0 0 0 9.238 4.786c2.05-.18 4.604-.436 7.64-.792a5.415 5.415 0 0 0 4.805-5.377V73.722" fill="#0A0B0D" />
                        <path d="M32.856 73.722a6.495 6.495 0 0 1 6.526-6.495l10.82.036a6.505 6.505 0 0 1 6.505 6.504v40.913c1.218-.361 2.783-.747 4.495-1.15a5.42 5.42 0 0 0 4.178-5.274v-50.75a6.506 6.506 0 0 1 6.505-6.507h10.841a6.507 6.507 0 0 1 6.505 6.506v47.102s2.714-1.098 5.358-2.214a5.43 5.43 0 0 0 3.316-4.998V41.244a6.505 6.505 0 0 1 6.503-6.505h10.842a6.503 6.503 0 0 1 6.505 6.505v46.24c9.399-6.813 18.924-15.005 26.483-24.857a10.93 10.93 0 0 0 1.662-10.193A76.58 76.58 0 0 0 76.662 1.005a76.57 76.57 0 0 0-65.488 114.706 9.69 9.69 0 0 0 9.238 4.786c2.05-.18 4.604-.436 7.64-.792a5.415 5.415 0 0 0 4.805-5.377V73.722" stroke="#fff" />
                        <path d="M32.62 139.343a76.596 76.596 0 0 0 121.659-61.962 78 78 0 0 0-.2-5.242c-27.988 41.741-79.664 61.256-121.457 67.197" fill="#C0D0DB" />
                    </svg>

                </a>

                {/* Twitter */}
                <a
                    href="https://x.com/asciicast"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-500"
                >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 512">
                        <circle cx="256" cy="256" r="256" fill="currentColor" />
                        <path fill="black" fillRule="nonzero" d="M318.64 157.549h33.401l-72.973 83.407 85.85 113.495h-67.222l-52.647-68.836-60.242 68.836h-33.423l78.052-89.212-82.354-107.69h68.924l47.59 62.917zm-11.724 176.908h18.51L205.95 176.493h-19.86z" />
                    </svg>
                </a>

                {/* Farcaster */}
                <a
                    href="https://farcaster.xyz/asciicast"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-purple-500"
                >
                    <svg className="w-5 h-5" viewBox="0 0 1000 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <rect width="1000" height="1000" rx="200" />
                        <path d="M257.778 155.556h484.444v688.888h-71.111V528.889h-.697c-7.86-87.212-81.156-155.556-170.414-155.556s-162.554 68.344-170.414 155.556h-.697v315.555h-71.111z" fill="#fff" />
                        <path d="m128.889 253.333 28.889 97.778h24.444v395.556c-12.273 0-22.222 9.949-22.222 22.222v26.667h-4.444c-12.273 0-22.223 9.949-22.223 22.222v26.666h248.889v-26.666c0-12.273-9.949-22.222-22.222-22.222h-4.444v-26.667c0-12.273-9.95-22.222-22.223-22.222h-26.666V253.333zm546.667 493.334c-12.273 0-22.223 9.949-22.223 22.222v26.667h-4.444c-12.273 0-22.222 9.949-22.222 22.222v26.666h248.889v-26.666c0-12.273-9.95-22.222-22.223-22.222h-4.444v-26.667c0-12.273-9.949-22.222-22.222-22.222V351.111h24.444L880 253.333H702.222v493.334z" fill="#fff" />
                    </svg>

                </a>

            </div>
        </footer>
    );
};

export default Footer;
