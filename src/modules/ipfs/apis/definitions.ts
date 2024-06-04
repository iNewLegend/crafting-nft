interface BaseCommonStructure {
    ipfsHash: string;
    fileSize: number;
}

export interface CommonListStructure extends BaseCommonStructure {
    fileName: string;
    mimeType: string;
    datePinnedOrCreated: string;
    userId: string;
    additionalFields: Record<string, any>;
}

export interface CommonPinStructure extends BaseCommonStructure {
    timestamp: string;
    additionalFields: Record<string, any>;
}
