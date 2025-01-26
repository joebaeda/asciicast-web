import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="flex flex-col md:flex-row md:justify-between justify-center items-center">
            {/* Left Section: Copyright Info */}
            <div className="p-2 md:p-4">
                <span className="text-sm text-gray-600">
                    Build with <span className="font-extrabold text-red-800">❤</span> by{" "}
                    <a
                        href="https://warpcast.com/joebaeda"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-green-500"
                    >
                        Joe bae
                    </a>
                </span>
            </div>

            {/* Right Section: Social Links */}
            <div className="flex p-2 md:p-4 space-x-4">

                {/* GitHub */}
                <a
                    href="https://github.com/joebaeda/asciicast-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black"
                >
                    <svg className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 640 640">
                        <path d="M319.988 7.973C143.293 7.973 0 151.242 0 327.96c0 141.392 91.678 261.298 218.826 303.63 16.004 2.964 21.886-6.957 21.886-15.414 0-7.63-.319-32.835-.449-59.552-89.032 19.359-107.8-37.772-107.8-37.772-14.552-36.993-35.529-46.831-35.529-46.831-29.032-19.879 2.209-19.442 2.209-19.442 32.126 2.245 49.04 32.954 49.04 32.954 28.56 48.922 74.883 34.76 93.131 26.598 2.882-20.681 11.15-34.807 20.315-42.803-71.08-8.067-145.797-35.516-145.797-158.14 0-34.926 12.52-63.485 32.965-85.88-3.33-8.078-14.291-40.606 3.083-84.674 0 0 26.87-8.61 88.029 32.8 25.512-7.075 52.878-10.642 80.056-10.76 27.2.118 54.614 3.673 80.162 10.76 61.076-41.386 87.922-32.8 87.922-32.8 17.398 44.08 6.485 76.631 3.154 84.675 20.516 22.394 32.93 50.953 32.93 85.879 0 122.907-74.883 149.93-146.117 157.856 11.481 9.921 21.733 29.398 21.733 59.233 0 42.792-.366 77.28-.366 87.804 0 8.516 5.764 18.473 21.992 15.354 127.076-42.354 218.637-162.274 218.637-303.582 0-176.695-143.269-319.988-320-319.988l-.023.107z" />
                    </svg>

                </a>

                {/* Basescan */}
                <a
                    href="https://basescan.org/token/0x0a5053e62b6a452300d18aeef495c89ddf4c7b05"
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
                    href="https://twitter.com/asciicast"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-500"
                >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 512">
                        <circle cx="256" cy="256" r="256" fill="currentColor" />
                        <path fill="black" fillRule="nonzero" d="M318.64 157.549h33.401l-72.973 83.407 85.85 113.495h-67.222l-52.647-68.836-60.242 68.836h-33.423l78.052-89.212-82.354-107.69h68.924l47.59 62.917zm-11.724 176.908h18.51L205.95 176.493h-19.86z" />
                    </svg>
                </a>

                {/* Telegram */}
                <a
                    href="https://t.me/asciicast_chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-400"
                >
                    <svg className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 512">
                        <path d="M512 256C512 114.62 397.38 0 256 0S0 114.62 0 256s114.62 256 256 256 256-114.62 256-256m-396.12-2.7c74.63-32.52 124.39-53.95 149.29-64.31 71.1-29.57 85.87-34.71 95.5-34.88 2.12-.03 6.85.49 9.92 2.98 2.59 2.1 3.3 4.94 3.64 6.93.34 2 .77 6.53.43 10.08-3.85 40.48-20.52 138.71-29 184.05-3.59 19.19-10.66 25.62-17.5 26.25-14.86 1.37-26.15-9.83-40.55-19.27-22.53-14.76-35.26-23.96-57.13-38.37-25.28-16.66-8.89-25.81 5.51-40.77 3.77-3.92 69.27-63.5 70.54-68.9.16-.68.31-3.2-1.19-4.53s-3.71-.87-5.3-.51c-2.26.51-38.25 24.3-107.98 71.37-10.22 7.02-19.48 10.43-27.77 10.26-9.14-.2-26.72-5.17-39.79-9.42-16.03-5.21-28.77-7.97-27.66-16.82.57-4.61 6.92-9.32 19.04-14.14" />
                    </svg>
                </a>

                {/* Warpcast */}
                <a
                    href="https://warpcast.com/asciicast"
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
