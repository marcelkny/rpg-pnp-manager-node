export interface userConfigModel {
    userSettings: userSettingsModel;
    userRights: userRightsModel;
}

interface userSettingsModel {
    /** wantedContentLevel chosen by user
     * - aufsteigend von 1 - x
     * - 1 = general, 2 = moderate, 3 = adult, usw
     * - vergeben durch den User, immer <= maxContentLevel */
    wantedContentLevel: number;
}

interface userRightsModel {
    /** maxContentLevel given by administrator
     * - aufsteigend von 1 - x
     * - 1 = general, 2 = moderate, 3 = adult, usw
     * - vergeben durch Administrator */
    maxContentLevel: number;
}

export const initialUserConfig: userConfigModel = { userSettings: { wantedContentLevel: 1 }, userRights: { maxContentLevel: 1 } };
export const initialAdminConfig: userConfigModel = { userSettings: { wantedContentLevel: 5 }, userRights: { maxContentLevel: 5 } };
