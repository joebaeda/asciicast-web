import * as React from "react";
import { Connector, useConnect } from "wagmi";
import Image from "next/image";

export function Wallets({ onConnect }: { onConnect: () => void }) {
    const { connectors, connect } = useConnect();

    const handleConnect = async (connector: Connector) => {
        connect({ connector });
        onConnect(); // Notify the parent
    };

    return (
        <div className="space-y-4">
            {connectors.map((connector) => (
                <WalletOption
                    key={connector.uid}
                    connector={connector}
                    onClick={() => handleConnect(connector)}
                />
            ))}
        </div>
    );
}

function WalletOption({
    connector,
    onClick,
}: {
    connector: Connector;
    onClick: () => void;
}) {
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const provider = await connector.getProvider();
            setReady(!!provider);
        })();
    }, [connector]);

    return (
        <button
            className="w-full flex p-2 rounded-2xl justify-start gap-2 items-center bg-[#282828] hover:bg-[#1d1c1c] text-xl font-extrabold text-center"
            disabled={!ready}
            onClick={onClick}
        >
            <Image
                className="rounded-2xl w-10 h-10"
                src={connector.icon || "/icon.jpg"}
                width={60}
                height={60}
                priority
                alt={connector.name}
            />
            {connector.name}
        </button>
    );
}
