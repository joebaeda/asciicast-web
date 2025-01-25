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
        <div className="flex p-2 rounded-2xl justify-start gap-2 items-center bg-[#282828]">
            <Image className="rounded-2xl w-10 h-10" src={connector.icon || "/icon.jpg"} width={60} priority height={60} alt={connector.name} />
            <button
                className="text-xl font-extrabold text-center px-4"
                disabled={!ready}
                onClick={onClick}
            >
                {connector.name}
            </button>
        </div>
    );
}
