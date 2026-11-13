# Container Security Notes

## Latest assessment

- Assessment date: 2026-11-13
- Image: `chat-service:debian`
- Image digest prefix: `0f5eb1eeba6f`
- Base image: `node:24-bookworm-slim`
- Platform: `linux/arm64`
- Scanner: Docker Scout 1.21.0

Command:

    docker scout cves chat-service:debian --only-severity critical,high

The filtered scan reported 0 critical and 7 high vulnerabilities.
Medium and low vulnerabilities were excluded from this assessment.

## Outstanding findings

| Package    | Installed version | Reported CVEs                                  | Fix status reported by Scout |
| ---------- | ----------------- | ---------------------------------------------- | ---------------------------- |
| util-linux | 2.38.1-5+deb12u3  | CVE-2026-53615, CVE-2026-78410, CVE-2026-53613 | Not fixed                    |
| zlib       | 1:1.2.13.dfsg-1   | CVE-2026-85091, CVE-2026-76844                 | Not fixed                    |
| glibc      | 2.36-9+deb12u14   | CVE-2026-84243                                 | Not fixed                    |
| perl       | 5.36.0-7+deb12u4  | CVE-2026-82560                                 | Not fixed                    |

These findings come from the Debian packages included in the image.
Exploitability in this service has not been assessed. Successful application
tests do not establish that these vulnerabilities are mitigated.

“Not fixed” reflects the scanner's report at the assessment date and must
be checked again against Debian's security tracker and updated scan results.

## Changes already applied

- Updated Mongoose to 7.8.13.
- Updated body-parser to 1.20.9.
- Updated ip-address to 10.7.6.
- Removed npm and npx from the production image after dependency installation.
  This removed the reported undici and brace-expansion findings from the
  resulting image.

## Follow-up

- Verify the reported CVEs against the Debian Security Tracker:
  https://security-tracker.debian.org/
- Rebuild with an updated base image and repeat the scan before merging
  or deploying.
- Apply available fixes and rerun application checks and container smoke tests.
- Record the new image digest and scan results after remediation.
- Review the separate npm audit findings, including development dependencies.

This document tracks outstanding findings; it does not constitute a security
approval or risk acceptance.
