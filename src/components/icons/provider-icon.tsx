import GitHubIcon from "./github-icon";
import GoogleIcon from "./google-icon";

type ProviderIconProps = {
  provider: "google" | "github" | string;
};

export function ProviderIcon({ provider }: ProviderIconProps) {
  if (provider === "google") {
    return <GoogleIcon />;
  }

  return <GitHubIcon />;
}
