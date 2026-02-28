const parseAdminSet = (raw) => {
  if (!raw) return new Set();
  return new Set(
    String(raw)
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
  );
};

const isAdminUser = (user) => {
  if (!user) return false;

  // 1. Check database role (Priority 1)
  if (user.role === 'admin') return true;

  // 2. Check environment variables (Priority 2)
  const emails = parseAdminSet([process.env.ADMIN_EMAILS, process.env.ADMIN_EMAIL].filter(Boolean).join(','));
  const phones = parseAdminSet([process.env.ADMIN_PHONES, process.env.ADMIN_PHONE].filter(Boolean).join(','));
  const ids = parseAdminSet([process.env.ADMIN_USER_IDS, process.env.ADMIN_USER_ID].filter(Boolean).join(','));

  const hasConfig = emails.size || phones.size || ids.size;
  const fallbackDevAdmin = !hasConfig && process.env.NODE_ENV !== 'production';

  if (fallbackDevAdmin) return user.id === 1;

  if (ids.size && ids.has(String(user.id))) return true;
  if (user.email && emails.size && emails.has(user.email)) return true;
  if (user.phone && phones.size && phones.has(user.phone)) return true;
  
  return false;
};

module.exports = {
  isAdminUser,
};
