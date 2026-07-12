export const UserRole = {
  SYSTEM_ADMIN: 'ROLE_SYSTEM_ADMIN',
  FAMILY_LEADER: 'ROLE_CLAN_LEADER',
  FAMILY_ADMIN: 'ROLE_CLAN_ADMIN',
  FAMILY_MEMBER: 'ROLE_CLAN_MEMBER',
  VIEWER: 'ROLE_VIEWER',
};

export const UserRoleOptions = [
  { value: UserRole.SYSTEM_ADMIN, name: 'Admin hệ thống' },
  { value: UserRole.FAMILY_LEADER, name: 'Trưởng họ' },
  { value: UserRole.FAMILY_ADMIN, name: 'Quản trị dòng họ' },
  { value: UserRole.FAMILY_MEMBER, name: 'Thành viên dòng họ' },
  { value: UserRole.VIEWER, name: 'Khách xem' },
];

export const Gender = {
  MALE: 'M',
  FEMALE: 'F',
};

export const GenderOptions = [
  { value: Gender.MALE, name: 'Nam' },
  { value: Gender.FEMALE, name: 'Nữ' },
];

export const Visibility = {
  PUBLIC: 'PUBLIC',
  PROTECTED: 'PROTECTED',
  PRIVATE: 'PRIVATE',
};

export const VisibilityOptions = [
  { value: Visibility.PUBLIC, name: 'Công khai (Tất cả mọi người)' },
  { value: Visibility.PROTECTED, name: 'Nội bộ dòng họ (Yêu cầu đăng nhập)' },
  { value: Visibility.PRIVATE, name: 'Chỉ admin/Trưởng họ xem' },
];

export const PostCategory = {
  TIN_TUC: 'TIN_TUC',
  HOAT_DONG: 'HOAT_DONG',
};

export const PostCategoryOptions = [
  { value: PostCategory.TIN_TUC, name: 'Tin tức chung' },
  { value: PostCategory.HOAT_DONG, name: 'Hoạt động dòng họ' },
];

export const PostStatus = {
  PUBLISHED: 'PUBLISHED',
  DRAFT: 'DRAFT',
};

export const EventStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const TransactionType = {
  IN: 'IN',
  OUT: 'OUT',
};

export const TransactionStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

