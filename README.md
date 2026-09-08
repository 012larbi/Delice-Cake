# Délice Cake

Site vitrine premium + catalogue de gâteaux avec **commande par WhatsApp** et
**tableau de bord d'administration** (React + Vite + Tailwind + Framer Motion +
Firebase).

## Démarrer

```bash
npm install
npm run dev
```

Le site fonctionne **sans configuration** : les produits, nouveautés et
témoignages viennent alors de `src/data/products.js` (mode démo).

## Structure

```
src/
  components/        Sections du site public + composants UI réutilisables
  pages/Home.jsx     Assemble la landing page
  admin/             Espace d'administration (chargé à la demande)
    ui/              Primitives admin + CrudManager générique
    pages/           Dashboard, Produits, Catégories, Nouveautés, Témoignages, Avis clients, Images du site, Paramètres
  context/           AuthContext (Firebase Auth) + SiteSettings/SiteData
  services/          Firestore (firestore.js), contenu (content.js), upload images (storage.js)
  config/            firebase.js, cloudinary.js, whatsapp.js, map.js, images.js
  data/products.js   Données de secours (mode démo)
```

## Commande WhatsApp

Toute la logique est centralisée dans `src/config/whatsapp.js` :
`createWhatsAppOrderMessage`, `createCustomCakeMessage`, `openWhatsApp`,
`openWhatsAppOrder`, `openWhatsAppContact`.

Le numéro par défaut est dans `WHATSAPP_NUMBER`. Il peut aussi être changé
depuis **Admin → Paramètres** (stocké dans Firestore, appliqué à chaud).

## Activer Firebase (tableau de bord admin)

1. Créez un projet sur [console.firebase.google.com](https://console.firebase.google.com).
2. Activez **Authentication → Sign-in method → E-mail/Mot de passe** et créez un
   utilisateur admin.
3. Activez **Firestore Database** (mode production).
4. Copiez la config web :

   ```bash
   cp .env.example .env
   # puis renseignez les VITE_FIREBASE_*
   ```

5. **Déployez les règles Firestore** (`firestore.rules`) — sans ça, tout
   accès à la base est refusé (« Missing or insufficient permissions »).

   **Option A — Firebase CLI** (`firebase.json` + `.firebaserc` déjà fournis) :

   ```bash
   npm i -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules
   ```

   **Option B — Console (sans rien installer)** :
   Firebase Console → **Firestore Database → Règles** → coller le contenu de
   [`firestore.rules`](./firestore.rules) → **Publier**.

6. Lancez le site, connectez-vous sur `/admin/login`, puis
   **Paramètres → Importer les données de démo** pour peupler Firestore.

## Images (upload depuis le PC)

L'admin ajoute les images **depuis le PC** (file picker ou glisser-déposer) —
aucune URL à coller.

```
File picker → compression + resize (canvas) → WebP → hébergeur → URL
           → Firestore (URL uniquement, jamais de Base64)
```

Deux hébergeurs possibles (détection auto dans `src/services/storage.js`) :

| Hébergeur          | Plan requis | Config `.env`                                    |
| ------------------ | ----------- | ------------------------------------------------ |
| **Cloudinary** ✅  | gratuit     | `VITE_CLOUDINARY_CLOUD_NAME` + `_UPLOAD_PRESET`  |
| Firebase Storage   | **Blaze**   | `VITE_FIREBASE_STORAGE_BUCKET` + `cors.json`     |

> Firebase Storage n'est **pas disponible sur le plan gratuit (Spark)** pour les
> projets récents. Sur le plan gratuit → **Cloudinary**.

### Mettre en place Cloudinary (gratuit, ~2 min)

1. Compte sur [cloudinary.com](https://cloudinary.com) (gratuit, sans carte).
2. **Settings → Upload → Add upload preset** → *Signing Mode* = **Unsigned** →
   Save. Notez le nom du preset.
3. Le *Cloud name* est affiché sur le Dashboard.
4. Dans `.env` :
   ```
   VITE_CLOUDINARY_CLOUD_NAME=votre_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=votre_preset
   VITE_CLOUDINARY_FOLDER=delice-cake
   ```
5. `npm run dev` — l'upload fonctionne (Cloudinary autorise déjà le CORS
   navigateur, rien à configurer).

Détails :

- Presets par usage (`IMAGE_PRESETS`) : `product` 1200 px, `new` 1400 px,
  `hero` 2000 px. L'interface affiche le poids **avant → après**.
- **Toutes les grandes images du site** (accueil/hero, « Notre passion »,
  « Gâteau signature », image de partage réseaux sociaux) : **Admin → Images
  du site**. Bouton « Image par défaut » pour revenir au visuel intégré
  (`src/config/images.js`). Les photos des gâteaux se gèrent dans
  **Produits** / **Nouveautés**.
- Suppression : avec Firebase Storage, l'ancienne image est retirée
  automatiquement au remplacement/suppression. Avec Cloudinary, la suppression
  côté client n'est pas possible (clé secrète requise) — les anciens fichiers
  restent dans le dashboard Cloudinary (sans impact sur l'offre gratuite).

### Option Firebase Storage (plan Blaze uniquement)

Renseignez `VITE_FIREBASE_STORAGE_BUCKET`, déployez `storage.rules`
(`firebase deploy --only storage`), puis configurez le CORS du bucket **une
fois** avec le fichier [`cors.json`](./cors.json) :

```bash
gcloud auth login
gcloud config set project <PROJECT_ID>
gcloud storage buckets update gs://<BUCKET>.firebasestorage.app --cors-file=cors.json
# ou : gsutil cors set cors.json gs://<BUCKET>.firebasestorage.app
```

Raccourci : `bash scripts/apply-cors.sh`.

### Comportement

| Firebase        | Site public                         | `/admin`                                  |
| --------------- | ----------------------------------- | ----------------------------------------- |
| non configuré   | données statiques, WhatsApp OK      | accès démo en lecture seule (aucune écriture) |
| configuré       | contenu lu depuis Firestore         | connexion obligatoire, CRUD complet        |

Les commandes se passent uniquement via WhatsApp (message pré-rempli, pas de
back-office de commandes).

## Avis clients

Le bouton « Laisser un avis » (section Témoignages) ouvre un formulaire —
**nom + e-mail + texte obligatoires** (e-mail vérifié, jamais affiché
publiquement). L'avis part dans la collection `reviews` avec `status: pending`.
Dans **Admin → Avis clients**, chaque avis peut être **publié** (il devient un
témoignage visible) ou **refusé**. Règles Firestore : un visiteur peut
seulement *créer* un avis valide ; lecture/validation réservées à l'admin.

## Localisation (carte)

**Admin → Paramètres → Localisation** : colle le code `<iframe …>` de Google
Maps (adresse → Partager → « Intégrer une carte ») — seule l'URL `src` est
conservée, et uniquement si c'est un domaine `google.com/maps`. Vide = plan
illustré par défaut. Un lien Maps optionnel ajoute un bouton « Itinéraire ».

## Build

```bash
npm run build      # -> dist/
npm run preview
```

Le SDK Firebase est chargé dynamiquement : il n'alourdit le bundle que
lorsque `.env` est renseigné.
