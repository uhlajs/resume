# Resume

Shared resume content generates the website at https://uhlik.me and a one-page PDF. Python and Jinja2 render the HTML and TeX templates; Tectonic compiles the PDFs. The PDF retains the [sb2nov/resume](https://github.com/sb2nov/resume) typography and layout.

## Build and preview

```sh
nix develop -c just pdf
cp pdf/cv_uhlik.pdf public/
python -m http.server 8765 --bind 127.0.0.1 --directory public
```

Open http://127.0.0.1:8765/ to review the website and its PDF download. Run `nix flake check --all-systems` for the checks used by GitHub Actions.

- `content.yaml`: shared summary, experience, grouped skills, education, and link destinations.
- `templates/index.html`: website layout; `public/css/` and `public/js/` provide its styling and theme toggle.
- `templates/cv_uhlik.tex`: public one-page PDF template.
- `pdf/cv_uhlik.pdf`: public one-page PDF, copied into `public/` by the GitHub Actions build.

Generated HTML, TeX, and PDFs are ignored. Do not put generated TeX in `public/`. IBM Plex Sans is served locally from `public/fonts/`, with its license included. The existing profile image remains in `public/imgs/profile_designer.png` at its original crop.

## Content and design

Keep both formats concise and consistent. The PDF must remain one readable page; render it and inspect the page after layout changes. Review the website at desktop and mobile widths in both themes. Design choices are recorded in [.interface-design/system.md](.interface-design/system.md).

ISEE.ai experience begins in September 2021, is remote, and uses the title Senior DevOps Lead. Its current sections are Build, Cloud, Simulation, Automation, AI adoption, and NVIDIA Jetson. The sub-minute build result refers to incremental builds. Keep AWS cost and infrastructure-as-code coverage claims qualitative. Do not add internal team counts or unverified accomplishments.

Keep technology badges in grouped Technical skills, rather than under ISEE.ai. Additional experience starts with Silicon Hill. The PDF header includes the website, email, GitHub, and GitLab, with no personal location. The website's contact links also include the public key and PDF download. Avoid restoring old certificates, student projects, extra navigation, progression text, or an expandable experience section without a request.

Use English link destinations when available. LinuxDays links to its official 2019 English page because the current conference site has no English landing page. Its dates should not be represented as the dates of the applicant's involvement.

## Publish

The canonical source is [uhlajs/resume](https://github.com/uhlajs/resume), on the `main` branch. Pushes to `main` run [.github/workflows/pages.yml](.github/workflows/pages.yml): repository checks, website/PDF build, Pages artifact upload, and deployment through the `github-pages` environment. Pull requests build and check without deploying. The workflow can also be started manually.

GitHub Pages must use GitHub Actions as its publishing source. The temporary host is https://uhlajs.github.io/resume/; the custom domain is `uhlik.me`, configured in the repository's Pages settings. Update DNS only after a successful deployment. Enable HTTPS enforcement once GitHub has issued the custom-domain certificate.

For the apex domain, point an ALIAS/ANAME to `uhlajs.github.io`, or use the GitHub Pages A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. Replace incompatible old A/AAAA records when switching hosts. See [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

This public repository starts with a new root commit. Historical commits were deliberately excluded from the migration. Keep personal phone numbers and residential address fields out of the content and templates; generate only the public PDF. Do not push historical branches or tags from the former repository.
