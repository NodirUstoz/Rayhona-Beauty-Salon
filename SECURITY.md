# Security Guidelines for Rayhona Salon

This document outlines important security considerations for deploying and maintaining the Rayhona Salon application.

## ⚠️ IMPORTANT: Before Deploying

### 1. Change Default Credentials
The default login credentials in this repository are **NOT secure** and should never be used in production:

- **Default Username:** `user`
- **Default Password:** `CHANGE_THIS_PASSWORD`

### 2. Environment Variables Setup

Before deploying to production, you **MUST**:

1. Create a `.env.local` file (copy from `.env.example`)
2. Set secure credentials:
   ```bash
   NEXT_PUBLIC_ADMIN_USERNAME=your_secure_username
   NEXT_PUBLIC_ADMIN_PASSWORD=your_very_secure_password_here
   ```
3. Add your Google Script URL (if using Google Sheets integration):
   ```bash
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL=your_script_url
   ```

### 3. Password Best Practices

- Use strong passwords (minimum 12 characters)
- Include uppercase, lowercase, numbers, and special characters
- Never use common words or personal information
- Consider using a password manager

### 4. Production Deployment

For production deployments (Vercel, Netlify, etc.):

1. Set environment variables in your hosting platform's dashboard
2. **Never** hardcode credentials in source code
3. Keep `.env.local` out of version control (already in `.gitignore`)
4. Use different credentials for development and production

### 5. Current Authentication Method

This application uses client-side authentication stored in localStorage. This is suitable for:
- Internal tools
- Single-user environments
- Development/demo purposes

**For production use with multiple users, consider:**
- Server-side authentication (JWT, OAuth)
- Database-backed user management
- Role-based access control (RBAC)
- Session management on the server

### 6. Security Features Implemented

✅ Account lockout after failed login attempts (5 attempts)
✅ Session expiration (24 hours)
✅ Secure token generation
✅ Local storage encryption (consider adding)
✅ HTTPS/SSL (ensure on production)

### 7. Regular Security Updates

- Keep dependencies up to date: `npm audit` and `npm update`
- Monitor security advisories for Next.js and React
- Review and rotate credentials periodically
- Keep your deployment platform updated

## 🔒 Files Never to Commit

The following files contain sensitive information and should NEVER be committed:
- `.env.local`
- `.env.production.local`
- Any file with actual credentials
- Configuration files with API keys

## 📝 Security Checklist

Before making your repository public or deploying to production:

- [ ] Changed default password to a strong password
- [ ] Set up environment variables properly
- [ ] Removed any hardcoded credentials
- [ ] Tested login with new credentials
- [ ] Verified `.env.local` is in `.gitignore`
- [ ] Set up HTTPS in production
- [ ] Reviewed and updated dependencies (`npm audit`)
- [ ] Set up monitoring and logging for security events

## 🆘 Reporting Security Issues

If you discover a security vulnerability, please:
1. Do NOT create a public GitHub issue
2. Contact the repository maintainer privately
3. Provide detailed information about the vulnerability

## 📚 Additional Resources

- [Next.js Security Best Practices](https://nextjs.org/docs/deployment#security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

---
