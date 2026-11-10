# Backend — LAG Inc.

Backend JavaScript avec Node.js, Express et MySQL.

## État actuel

Les éléments suivants sont en place et ont été vérifiés :

- Serveur Express avec une route de santé : GET /api/health.
- Configuration MySQL centralisée avec un pool de connexions.
- Script de vérification de la connexion MySQL.
- Réponses JSON pour les routes inexistantes et les erreurs internes.

L’authentification, la création des comptes par l’administrateur et le changement du mot de passe temporaire restent à développer. Les champs et les échanges seront validés avec les responsables du frontend et de la base de données.

## Prérequis

- Node.js et npm. Versions utilisées : Node.js 24.14.0 et npm 11.9.0.
- Un serveur MySQL démarré.
- Une base et un utilisateur MySQL disposant des droits nécessaires.

Aucun script de création des tables n’est encore fourni dans ce dossier.

## Installation

Dans un terminal PowerShell ouvert dans le dossier backend, exécuter :

`npm.cmd ci`

Cette commande installe les versions des dépendances enregistrées dans package-lock.json.

## Configuration locale

Lors de la première installation, créer un fichier .env à partir du modèle .env.example, uniquement si .env n’existe pas déjà.

Compléter les paramètres avec les valeurs de son environnement :

- DB_HOST : adresse du serveur MySQL.
- DB_PORT : port MySQL.
- DB_NAME : nom de la base.
- DB_USER : utilisateur MySQL de l’application.
- DB_PASSWORD : mot de passe de cet utilisateur.

La configuration locale actuelle utilise la base lag_gestion_projets_db.

Le fichier .env reste privé et est exclu de Git. Le modèle .env.example peut être partagé et ne doit contenir aucun secret.

## Vérification MySQL

Depuis le dossier backend, exécuter dans PowerShell :

`node src/check-db.js`

Résultat attendu avec la configuration actuelle :

Connexion MySQL réussie : lag_gestion_projets_db

Cette vérification confirme l’accès à la base, sans valider les tables ni les fonctionnalités métier.

## Démarrage

Depuis le dossier backend, exécuter une seule des commandes suivantes :

- Développement avec redémarrage automatique : `npm.cmd run dev`
- Démarrage simple : `npm.cmd start`

Adresse locale : http://127.0.0.1:3000

Pour arrêter le serveur, utiliser Ctrl+C dans son terminal.

## Vérifications HTTP

- GET /api/health : statut HTTP 200 et réponse {"status":"ok"}. Cette route vérifie Express sans interroger MySQL.
- Une route inconnue, par exemple /api/inconnue : statut HTTP 404 et erreur NOT_FOUND.
- Une erreur inattendue transmise au gestionnaire : statut HTTP 500 et erreur INTERNAL_ERROR, sans détails internes dans la réponse.
- Un corps JSON mal formé avec Content-Type: application/json : statut HTTP 400 et erreur INVALID_JSON.
- Un corps JSON dépassant 16 Ko : statut HTTP 413 et erreur PAYLOAD_TOO_LARGE.

## Fichiers principaux

- src/app.js : application Express et routes.
- src/server.js : démarrage du serveur.
- src/config/db.js : configuration du pool MySQL.
- src/check-db.js : vérification ponctuelle de la connexion MySQL.
- src/middlewares/errorHandler.js : gestion des erreurs inattendues.