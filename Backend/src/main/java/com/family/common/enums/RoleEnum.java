package com.family.common.enums;

import java.util.Arrays;
import java.util.List;

public enum RoleEnum {
    ROLE_SYSTEM_ADMIN,
    ROLE_CLAN_LEADER,
    ROLE_CLAN_ADMIN,
    ROLE_CLAN_MEMBER,
    ROLE_VIEWER;

    public List<PrivilegeEnum> getPrivileges() {
        switch (this) {
            case ROLE_SYSTEM_ADMIN:
                return Arrays.asList(PrivilegeEnum.values());
            case ROLE_CLAN_LEADER:
                return Arrays.asList(
                    PrivilegeEnum.PROFILE_VIEW, PrivilegeEnum.PROFILE_CREATE, PrivilegeEnum.PROFILE_EDIT, PrivilegeEnum.PROFILE_DELETE,
                    PrivilegeEnum.TREE_VIEW, PrivilegeEnum.TREE_EDIT, PrivilegeEnum.TREE_EXPORT,
                    PrivilegeEnum.EVENT_VIEW, PrivilegeEnum.EVENT_CREATE, PrivilegeEnum.EVENT_EDIT, PrivilegeEnum.EVENT_DELETE,
                    PrivilegeEnum.POST_VIEW, PrivilegeEnum.POST_CREATE, PrivilegeEnum.POST_EDIT, PrivilegeEnum.POST_DELETE,
                    PrivilegeEnum.GALLERY_VIEW, PrivilegeEnum.GALLERY_CREATE, PrivilegeEnum.GALLERY_EDIT, PrivilegeEnum.GALLERY_DELETE, PrivilegeEnum.GALLERY_UPLOAD,
                    PrivilegeEnum.FUND_VIEW, PrivilegeEnum.FUND_MANAGE, PrivilegeEnum.FUND_TRANSACTION, PrivilegeEnum.FUND_REPORT,
                    PrivilegeEnum.FILE_UPLOAD_PUBLIC, PrivilegeEnum.FILE_UPLOAD_PRIVATE, PrivilegeEnum.FILE_DELETE,
                    PrivilegeEnum.USER_VIEW, PrivilegeEnum.USER_CREATE, PrivilegeEnum.USER_EDIT, PrivilegeEnum.USER_DELETE, PrivilegeEnum.USER_ROLE
                );
            case ROLE_CLAN_ADMIN:
                return Arrays.asList(
                    PrivilegeEnum.PROFILE_VIEW, PrivilegeEnum.PROFILE_CREATE, PrivilegeEnum.PROFILE_EDIT,
                    PrivilegeEnum.TREE_VIEW,
                    PrivilegeEnum.EVENT_VIEW, PrivilegeEnum.EVENT_CREATE, PrivilegeEnum.EVENT_EDIT,
                    PrivilegeEnum.POST_VIEW, PrivilegeEnum.POST_CREATE, PrivilegeEnum.POST_EDIT,
                    PrivilegeEnum.GALLERY_VIEW, PrivilegeEnum.GALLERY_CREATE, PrivilegeEnum.GALLERY_EDIT, PrivilegeEnum.GALLERY_UPLOAD,
                    PrivilegeEnum.FUND_VIEW, PrivilegeEnum.FUND_TRANSACTION,
                    PrivilegeEnum.FILE_UPLOAD_PUBLIC, PrivilegeEnum.FILE_UPLOAD_PRIVATE
                );
            case ROLE_CLAN_MEMBER:
                return Arrays.asList(
                    PrivilegeEnum.PROFILE_VIEW,
                    PrivilegeEnum.TREE_VIEW,
                    PrivilegeEnum.EVENT_VIEW,
                    PrivilegeEnum.POST_VIEW,
                    PrivilegeEnum.GALLERY_VIEW,
                    PrivilegeEnum.FUND_VIEW
                );
            case ROLE_VIEWER:
            default:
                return Arrays.asList(
                    PrivilegeEnum.PROFILE_VIEW,
                    PrivilegeEnum.TREE_VIEW,
                    PrivilegeEnum.EVENT_VIEW,
                    PrivilegeEnum.POST_VIEW
                );
        }
    }
}
