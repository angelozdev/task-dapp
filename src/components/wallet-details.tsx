import useSyncProviders from "../hooks/use-sync-providers";
import { Button, Card } from "./ui";

interface Props {
  selectedWallet: EIP6963ProviderDetail | null;
  userAccount: string | undefined;
  onConnect(provider: EIP6963ProviderDetail): void;
}

function WalletDetails({
  selectedWallet,
  userAccount,
  onConnect,
}: Readonly<Props>) {
  const providers = useSyncProviders();

  return (
    <Card title="DTaskApp">
      <div className="flex flex-col">
        <span>Connected Wallet:</span>
        <div className="flex items-center gap-2">
          {!!selectedWallet && (
            <img
              className="w-4 h-4"
              src={selectedWallet.info.icon}
              alt={selectedWallet.info.name}
            />
          )}
          <span>{selectedWallet?.info.name ?? "No wallet connected"}</span>
        </div>
        {userAccount && (
          <span className="block text-xs text-gray-500 ">{userAccount}</span>
        )}

        {!selectedWallet && (
          <ul className="flex flex-col gap-2 mt-4">
            {providers.map((provider) => (
              <li key={provider.info.uuid}>
                <Button
                  onClick={() => onConnect(provider)}
                  className="flex flex-row items-center gap-2"
                >
                  <span>Connect {provider.info.name}</span>
                  <img
                    className="w-4 h-4"
                    src={provider.info.icon}
                    alt={provider.info.name}
                  />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

export default WalletDetails;
