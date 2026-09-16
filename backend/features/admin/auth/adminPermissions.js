export const ADMIN_PERMISSIONS = Object.freeze({
  DASHBOARD_READ: "dashboard:read",
  CMS_READ: "cms:read",
  CMS_WRITE: "cms:write",
  MEDIA_READ: "media:read",
  MEDIA_WRITE: "media:write",
  CRM_READ: "crm:read",
  CRM_WRITE: "crm:write",
  PORTAL_READ: "portal:read",
  PORTAL_WRITE: "portal:write",
  SETTINGS_READ: "settings:read",
  SETTINGS_WRITE: "settings:write",
  AUDIT_READ: "audit:read",
});

export const ROLE_PERMISSIONS = Object.freeze({
  super_admin: ["*"],
  content_admin: [
    ADMIN_PERMISSIONS.DASHBOARD_READ,
    ADMIN_PERMISSIONS.CMS_READ,
    ADMIN_PERMISSIONS.CMS_WRITE,
    ADMIN_PERMISSIONS.MEDIA_READ,
    ADMIN_PERMISSIONS.MEDIA_WRITE,
  ],
  operations_admin: [
    ADMIN_PERMISSIONS.DASHBOARD_READ,
    ADMIN_PERMISSIONS.CRM_READ,
    ADMIN_PERMISSIONS.CRM_WRITE,
    ADMIN_PERMISSIONS.PORTAL_READ,
    ADMIN_PERMISSIONS.PORTAL_WRITE,
  ],
  viewer: [
    ADMIN_PERMISSIONS.DASHBOARD_READ,
    ADMIN_PERMISSIONS.CMS_READ,
    ADMIN_PERMISSIONS.MEDIA_READ,
    ADMIN_PERMISSIONS.CRM_READ,
    ADMIN_PERMISSIONS.PORTAL_READ,
    ADMIN_PERMISSIONS.SETTINGS_READ,
    ADMIN_PERMISSIONS.AUDIT_READ,
  ],
});

export const can = (permissions, requiredPermission) =>
  permissions.includes("*") || permissions.includes(requiredPermission);

