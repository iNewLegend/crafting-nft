export interface CommonListStructure {
    ipfsHash: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    datePinnedOrCreated: string;
    userId: string;
    additionalFields: Record<string, any>;
}
