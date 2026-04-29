# Alam Group website

Static family office site (HTML/CSS/JS).

## GitHub Pages + custom domain

### 1. Push this folder to GitHub

1. Create a new empty repository on GitHub (e.g. `alam-group-website`), **without** adding a README (so your local history stays clean).
2. In Terminal, from this folder:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Turn on GitHub Pages

1. On GitHub: **Settings → Pages**.
2. **Source:** Deploy from branch **main**, folder **/ (root)**.
3. Save. After a few minutes the site is live at:

`https://YOUR_USERNAME.github.io/YOUR_REPO/`

(If the repo is named `YOUR_USERNAME.github.io`, the site is at `https://YOUR_USERNAME.github.io/` with files at the repo root.)

### 3. Point your domain (e.g. alamgroup.ca)

**In GitHub (repo Settings → Pages):**

- Under **Custom domain**, enter your apex or `www` hostname (e.g. `alamgroup.ca` or `www.alamgroup.ca`).
- Enable **Enforce HTTPS** after DNS has propagated.

**At your domain registrar (DNS):**

**Option A — Apex domain (`alamgroup.ca`)**

Add these **A** records (GitHub’s current IPs; confirm in [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)):

| Type | Name | Data |
|------|------|------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

**Option B — `www` subdomain**

| Type | Name | Data |
|------|------|------|
| CNAME | www | `YOUR_USERNAME.github.io` |

For a **project** site (`username.github.io/repo-name`), the CNAME target is still `YOUR_USERNAME.github.io`; GitHub routes by the custom domain you set in the repo.

**Repo file (optional):** After you set the custom domain in Settings, GitHub may add a `CNAME` file. Commit it so the domain setting stays in sync with the repo.

### 4. Wait for DNS

Propagation can take from a few minutes to 48 hours. Use your registrar’s DNS checker or `dig alamgroup.ca` to verify.
