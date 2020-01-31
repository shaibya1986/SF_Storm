export interface IRegion {
    region?: string;
    regionId?: string;
    noOfMeter?: number;
    imagePath?: string;
    stromPath?: string;
    isStromPredicted?: boolean;
    isApproved?: boolean;
    isRequestRaised?: boolean;
    isRejected?: boolean;
    severity?: number;
    severityPercentage?: string;
}

export interface IMeter {
    meterId?: string;
    location?: string;
    meterName?: string;
    health?: string;
    region?: string;
    isApproved?: boolean;
    isMeterOn?: number;
    apiStatus?: string;
    isToggling?: boolean;
}
export interface IBearertoken {
    access_token: string;
    signature: string;
    scope: string;
    instance_url: string;
    id: string;
    token_type: string;
    issued_at: string;
}