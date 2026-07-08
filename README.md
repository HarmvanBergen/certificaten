# Certificatenwebsite voor GitHub Pages

Dit is een **starter-template** voor een persoonlijke certificatenwebsite op **GitHub Pages**.
De site gebruikt:

- **platte bestanden** (HTML, CSS, JavaScript)
- **één databron**: `data/certificates.json`
- **optionele GitHub Actions deployment** via `.github/workflows/deploy.yml`

## Structuur

```text
certificaten-github-pages-starter/
├── .github/workflows/deploy.yml
├── app.js
├── data/certificates.json
├── index.html
├── styles.css
├── certificates-template.csv
└── README.md
```

## Datamodel

Per certificaat gebruik je deze velden:

- `title`
- `provider`
- `type`
- `domains` (array)
- `level`
- `issue_date` (`YYYY-MM-DD`)
- `expiry_date` (`YYYY-MM-DD` of leeg)
- `credential_id`
- `credential_url`
- `learning_path`
- `description`
- `tags` (array)

## Categorie-advies

### Technisch
- Cloud
- Security
- Automation
- Development
- Endpoint / M365

### Mens & proces
- Customer Service
- Communication
- Leadership
- HR / People
- Process Improvement

### Strategisch
- AI
- Consultancy
- Service Delivery
- Operations
- Business Skills

## Eerste inrichting

1. Maak een nieuwe GitHub-repository aan.
2. Upload alle bestanden uit deze map naar de root van je repository.
3. Pas `data/certificates.json` aan met je echte certificaten.
4. Commit en push je wijzigingen.
5. Kies **één** deploymentmethode:
   - **Simpel:** Settings → Pages → *Deploy from a branch* → `main` + `/ (root)`
   - **Modern / schaalbaar:** Settings → Pages → *GitHub Actions* en gebruik de meegeleverde workflow
6. Open daarna je GitHub Pages-URL.

## Data aanpassen

Je kunt de JSON handmatig bewerken of eerst de CSV-template invullen en daarna de data omzetten naar JSON.

### Voorbeeld record

```json
{
  "title": "Microsoft Certified: Azure Administrator Associate",
  "provider": "Microsoft",
  "type": "Certification",
  "domains": ["Cloud", "Endpoint / M365"],
  "level": "Intermediate",
  "issue_date": "2025-11-14",
  "expiry_date": "2026-11-14",
  "credential_id": "MS-EXAMPLE-001",
  "credential_url": "https://learn.microsoft.com/credentials/",
  "learning_path": "Cloud Engineer",
  "description": "Bevestigt kennis van Azure-resources, governance, storage, compute en netwerkbeheer.",
  "tags": ["Azure", "Administration", "Support"]
}
```

## Best practices

- Publiceer **alleen metadata en verificatielinks** als je privacy belangrijk vindt.
- Upload **geen certificaat-PDF's** met persoonsgegevens tenzij je dat expliciet wilt.
- Gebruik consistente domeinnamen zoals `AI`, `Cloud`, `Customer Service`, `HR / People`.
- Houd `issue_date` en `expiry_date` strak in `YYYY-MM-DD` voor correcte filtering.
- Gebruik pull requests of minimaal duidelijke commit messages, zodat je changes later kunt herleiden.

## Volgende uitbreidingen

- detailpagina per certificaat
- aparte pagina's per domein of provider
- sortering op recente certificaten
- dark/light mode
- export vanuit CSV naar JSON met een script
- custom domain koppelen
