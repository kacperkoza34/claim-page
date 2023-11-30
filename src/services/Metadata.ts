import axios from "axios";

export interface OffChainMetadata extends Record<string, unknown> {
  image?: string;
  properties?: {
    collection?: string;
  };
}

export class Metadata {
  static IPFSGateway = "https://ipfs.io/ipfs/";
  public metadataUri: string;
  private metadata: Record<string, unknown> | null = null;

  constructor(originalCid: string) {
    this.metadataUri = Metadata.decodeCid(originalCid);
  }

  async getMetadata(): Promise<Record<string, unknown>> {
    if (this.metadata) {
      return this.metadata;
    }

    const { data } = await axios.get<OffChainMetadata>(
      Metadata.prepareMetadataUri(this.metadataUri)
    );

    return (this.metadata = data);
  }

  static prepareMetadataUri(uri: string): string {
    if (uri.startsWith("https://") || uri.startsWith("https://")) {
      return uri;
    }

    if (uri.startsWith("ipfs://")) {
      return Metadata.IPFSGateway + uri.replace("ipfs://", "");
    }

    return Metadata.IPFSGateway + uri;
  }

  static decodeCid(metadataUri: string): string {
    return Buffer.from(metadataUri, "base64").toString();
  }
}
