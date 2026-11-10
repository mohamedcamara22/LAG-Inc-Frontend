
import React, { useState } from "react";


// Données fictives pour essayer les écrans sans Backend.
const comptesInitiaux = [
  { id: 1, identifiant: "admin.demo", nom: "Administrateur démo", role: "Administrateur", actif: true },
  { id: 2, identifiant: "gestion.demo", nom: "Gestionnaire démo", role: "Gestionnaire", actif: true },
  { id: 3, identifiant: "employe.demo", nom: "Employé démo", role: "Employé", actif: true }
];

const tachesExemples = [
  { id: 1, nom: "Analyse des besoins", projet: "Projet exemple", statut: "En cours", estimation: 8 },
  { id: 2, nom: "Tests", projet: "Projet exemple", statut: "À faire", estimation: 5 },
  { id: 3, nom: "Livraison", projet: "Projet exemple", statut: "Terminée", estimation: 2 }
];

export default function App() {
  const [comptes, setComptes] = useState(comptesInitiaux);
  const [utilisateur, setUtilisateur] = useState(null);
  const [page, setPage] = useState("Accueil");
  const [premiereConnexion, setPremiereConnexion] = useState(false);

  function connecter(identifiant) {
    // Démonstration seulement : aucun mot de passe n’est vérifié ici.
    const compte = comptes.find(c => c.identifiant === identifiant.trim() && c.actif);
    if (!compte) return false;
    setUtilisateur(compte);
    setPremiereConnexion(Boolean(compte.changementRequis));
    setPage("Accueil");
    return true;
  }

  function deconnecter() {
    setUtilisateur(null);
    setPremiereConnexion(false);
    setPage("Accueil");
  }

  function terminerPremiereConnexion(nouveauMotDePasse) {
    // Prototype : ne pas stocker de vrais mots de passe dans le navigateur.
    setComptes(comptes.map(c => c.id === utilisateur.id ? { ...c, changementRequis: false } : c));
    setUtilisateur({ ...utilisateur, changementRequis: false });
    setPremiereConnexion(false);
  }

  return (
    <div className="application">
      <header className="entete">
        <div><strong>LAG Inc.</strong><small>Projet de conception — Sprint 2</small></div>
        <span className="etiquette">Prototype sans Backend</span>
      </header>

      {!utilisateur ? (
        <Connexion connecter={connecter} />
      ) : premiereConnexion ? (
        <PremiereConnexion terminer={terminerPremiereConnexion} deconnecter={deconnecter} />
      ) : (
        <main className="contenu">
          <div className="ligne">
            <div><h1>Espace {utilisateur.role.toLowerCase()}</h1><p>Bienvenue, {utilisateur.nom}</p></div>
            <button className="secondaire" onClick={deconnecter}>Déconnexion</button>
          </div>
          <nav className="menu">
            <button onClick={() => setPage("Accueil")}>Accueil</button>
            {utilisateur.role === "Administrateur" && <button onClick={() => setPage("Utilisateurs")}>Utilisateurs</button>}
            {utilisateur.role === "Gestionnaire" && <button onClick={() => setPage("Modèles")}>Modèles</button>}
            {utilisateur.role === "Employé" && <button onClick={() => setPage("Feuille de temps")}>Feuille de temps</button>}
          </nav>
          {page === "Accueil" && <Accueil role={utilisateur.role} />}
          {page === "Utilisateurs" && utilisateur.role === "Administrateur" && (
            <Utilisateurs comptes={comptes} setComptes={setComptes} utilisateur={utilisateur} />
          )}
          {page === "Modèles" && utilisateur.role === "Gestionnaire" && <Modeles />}
          {page === "Feuille de temps" && utilisateur.role === "Employé" && <FeuilleTemps />}
        </main>
      )}
      <footer>React + Vite + JavaScript · Données de démonstration non enregistrées</footer>
    </div>
  );
}

function Connexion({ connecter }) {
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");

  function envoyer(e) {
    e.preventDefault();
    if (!identifiant.trim() || !motDePasse) {
      setErreur("Remplissez les deux champs.");
      return;
    }
    if (!connecter(identifiant)) {
      setErreur("Connexion impossible. Vérifiez vos informations.");
    } else {
      setErreur("");
    }
  }

  return (
    <main className="carte connexion">
      <h1>Connexion</h1>
      <p>Accès à l'application LAG Inc.</p>
      <form onSubmit={envoyer}>
        <label>Identifiant<input value={identifiant} onChange={e => setIdentifiant(e.target.value)} /></label>
        <label>Mot de passe<input type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} /></label>
        {erreur && <p className="erreur">{erreur}</p>}
        <button type="submit">Se connecter</button>
      </form>
      <p className="note">Essai : admin.demo, gestion.demo ou employe.demo. Utilisez un mot de passe fictif : il n'est pas vérifié.</p>
    </main>
  );
}

function PremiereConnexion({ terminer, deconnecter }) {
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState("");

  function envoyer(e) {
    e.preventDefault();
    if (motDePasse.length < 8) return setErreur("Utilisez au moins 8 caractères.");
    if (motDePasse !== confirmation) return setErreur("Les deux mots de passe sont différents.");
    setErreur("");
    terminer(motDePasse);
  }

  return <main className="carte connexion">
    <h1>Première connexion</h1>
    <p>Vous devez remplacer votre mot de passe temporaire avant d'accéder à votre espace.</p>
    <form onSubmit={envoyer}>
      <label>Nouveau mot de passe *<input type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} required minLength="8" /></label>
      <label>Confirmer le mot de passe *<input type="password" value={confirmation} onChange={e => setConfirmation(e.target.value)} required /></label>
      {erreur && <p className="erreur" role="alert">{erreur}</p>}
      <button type="submit">Confirmer</button>
      <button type="button" className="secondaire" onClick={deconnecter}>Annuler et se déconnecter</button>
    </form>
    <p className="note">Simulation uniquement : aucun mot de passe n'est enregistré ou envoyé à un serveur.</p>
  </main>;
}

function Accueil({ role }) {
  if (role === "Administrateur") return (
    <section className="carte"><h2>Administration</h2><p>Utilisez l'onglet « Utilisateurs » pour créer, modifier, activer ou désactiver un compte fictif.</p></section>
  );
  if (role === "Gestionnaire") return (
    <section className="carte">
      <h2>Tableau de bord gestionnaire</h2>
      <div className="grille">
        <article><h3>Projets</h3><p>Liste des projets et accès en lecture seule aux projets des autres.</p></article>
        <article><h3>Tâches</h3><p>Arborescence, états, affectations et estimations.</p></article>
        <article><h3>Modèles</h3><p>Créer et réutiliser des structures de tâches sans heures réelles.</p></article>
        <article><h3>Approbations</h3><p>Approuver ou rejeter les feuilles avec motif.</p></article>
        <article><h3>Suivi</h3><p>Comparer les heures estimées et les heures réelles.</p></article>
      </div>
      <p className="note">Ces cartes décrivent les écrans du Sprint 1. Elles ne sont pas connectées à des données réelles.</p>
    </section>
  );
  return (
    <section className="carte"><h2>Mes tâches</h2>
      <table><thead><tr><th>Tâche</th><th>Projet</th><th>État</th><th>Estimation</th></tr></thead><tbody>
        {tachesExemples.map(t => <tr key={t.id}><td>{t.nom}</td><td>{t.projet}</td><td>{t.statut}</td><td>{t.estimation} h</td></tr>)}
      </tbody></table>
      <p className="note">Exemples fictifs : la liste réelle devra provenir des affectations du Backend.</p>
    </section>
  );
}

function Utilisateurs({ comptes, setComptes, utilisateur }) {
  const [identifiant, setIdentifiant] = useState("");
  const [nom, setNom] = useState("");
  const [courriel, setCourriel] = useState("");
  const [role, setRole] = useState("Employé");
  const [idModifier, setIdModifier] = useState(null);
  const [message, setMessage] = useState("");
  const [temporaire, setTemporaire] = useState("");

  function vider() {
    setIdentifiant(""); setNom(""); setCourriel(""); setRole("Employé"); setIdModifier(null);
  }

  function enregistrer(e) {
    e.preventDefault();
    setTemporaire("");
    const id = identifiant.trim().toLowerCase();
    const email = courriel.trim().toLowerCase();
    if (!id || !nom.trim() || !email) return setMessage("Remplissez les champs obligatoires.");
    if (!/^[a-z0-9._-]{3,30}$/.test(id)) return setMessage("Identifiant : 3 à 30 caractères (lettres, chiffres, points, tirets).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMessage("Adresse courriel invalide.");
    if (comptes.some(c => c.identifiant.toLowerCase() === id && c.id !== idModifier)) return setMessage("Identifiant déjà utilisé.");
    if (comptes.some(c => c.courriel?.toLowerCase() === email && c.id !== idModifier)) return setMessage("Courriel déjà utilisé.");

    if (idModifier === null) {
      setComptes([...comptes, { id: Date.now(), identifiant: id, nom: nom.trim(), courriel: email, role, actif: true, changementRequis: true }]);
      setTemporaire("Temp1234!");
      setMessage("Compte fictif créé. Le changement du mot de passe sera obligatoire à la première connexion.");
    } else {
      setComptes(comptes.map(c => c.id === idModifier ? { ...c, identifiant: id, nom: nom.trim(), courriel: email, role } : c));
      setMessage("Compte fictif modifié.");
    }
    vider();
  }

  function modifier(c) {
    setIdModifier(c.id); setIdentifiant(c.identifiant); setNom(c.nom); setCourriel(c.courriel || ""); setRole(c.role);
    setMessage(""); setTemporaire("");
  }

  function changerEtat(c) {
    if (c.id === utilisateur.id) return;
    setComptes(comptes.map(x => x.id === c.id ? { ...x, actif: !x.actif } : x));
    setMessage("État du compte modifié dans la démonstration.");
    setTemporaire("");
  }

  return <section className="carte"><h2>Gestion des utilisateurs</h2>
    <p className="note">Les champs marqués * sont obligatoires. Identifiant et courriel doivent être uniques.</p>
    <form onSubmit={enregistrer} className="formulaire">
      <label>Identifiant *<input value={identifiant} onChange={e => setIdentifiant(e.target.value)} required placeholder="exemple.employe" /></label>
      <label>Nom complet *<input value={nom} onChange={e => setNom(e.target.value)} required placeholder="Employé exemple" /></label>
      <label>Courriel *<input type="email" value={courriel} onChange={e => setCourriel(e.target.value)} required placeholder="exemple@lag.test" /></label>
      <label>Rôle *<select value={role} onChange={e => setRole(e.target.value)}><option>Administrateur</option><option>Gestionnaire</option><option>Employé</option></select></label>
      <button type="submit">{idModifier === null ? "Créer un compte" : "Enregistrer"}</button>
      {idModifier !== null && <button type="button" className="secondaire" onClick={() => { vider(); setMessage(""); }}>Annuler</button>}
    </form>
    {message && <p className="message" role="status">{message}</p>}
    {temporaire && <p className="message">Mot de passe temporaire fictif : <strong>{temporaire}</strong> (à transmettre hors de cette démo ; mode réel à décider avec l'équipe).</p>}
    <table><thead><tr><th>Identifiant</th><th>Nom</th><th>Courriel</th><th>Rôle</th><th>État</th><th>Actions</th></tr></thead><tbody>
      {comptes.map(c => <tr key={c.id}><td>{c.identifiant}</td><td>{c.nom}</td><td>{c.courriel || "Non renseigné"}</td><td>{c.role}</td><td>{c.actif ? "Actif" : "Inactif"}</td><td>
        <button className="secondaire petit" onClick={() => modifier(c)}>Modifier</button>{" "}
        <button className="secondaire petit" disabled={c.id === utilisateur.id} onClick={() => changerEtat(c)}>{c.actif ? "Désactiver" : "Réactiver"}</button>
      </td></tr>)}
    </tbody></table>
    <p className="note">Les modifications disparaissent au rechargement de la page. Aucun compte n'est créé dans MySQL. Le mot de passe n'est pas réellement vérifié.</p>
  </section>;
}

function Modeles() {
  const [modeles, setModeles] = useState([]);
  const [code, setCode] = useState("");
  const [nom, setNom] = useState("");
  const [taches, setTaches] = useState([{ nom: "", estimation: "" }]);
  const [message, setMessage] = useState("");

  function ajouterTache() { setTaches([...taches, { nom: "", estimation: "" }]); }
  function changerTache(index, champ, valeur) {
    setTaches(taches.map((t, i) => i === index ? { ...t, [champ]: valeur } : t));
  }
  function enregistrer(e) {
    e.preventDefault();
    if (!code.trim() || !nom.trim() || taches.some(t => !t.nom.trim() || t.estimation === "" || Number(t.estimation) < 0)) {
      return setMessage("Renseignez le code, le nom et les tâches avec des heures valides.");
    }
    if (modeles.some(m => m.code === code.trim())) return setMessage("Ce code existe déjà.");
    if (taches.some(t => !Number.isFinite(Number(t.estimation)))) return setMessage("Estimation invalide.");
    setModeles([...modeles, { code: code.trim(), nom: nom.trim(), taches: taches.map(t => ({ nom: t.nom.trim(), estimation: Number(t.estimation) })) }]);
    setCode(""); setNom(""); setTaches([{ nom: "", estimation: "" }]); setMessage("Modèle fictif ajouté.");
  }
  function supprimer(m) {
    const confirmation = window.prompt("Pour supprimer, saisissez exactement le code : " + m.code);
    if (confirmation === m.code) setModeles(modeles.filter(x => x.code !== m.code));
  }
  return <section className="carte"><h2>Créer un modèle indépendant d'un projet</h2>
    <p className="note">Ajout demandé oralement par le professeur ; détails à valider avec l'équipe.</p>
    <form onSubmit={enregistrer}>
      <div className="formulaire"><label>Code du modèle<input value={code} onChange={e => setCode(e.target.value)} /></label><label>Nom du modèle<input value={nom} onChange={e => setNom(e.target.value)} /></label></div>
      <h3>Tâches et estimations</h3>
      {taches.map((t, i) => <div className="ligne-tache" key={i}>
        <input aria-label="Nom de la tâche" placeholder="Nom de la tâche" value={t.nom} onChange={e => changerTache(i, "nom", e.target.value)} />
        <input aria-label="Heures estimées" type="number" min="0" step="0.5" placeholder="Heures" value={t.estimation} onChange={e => changerTache(i, "estimation", e.target.value)} />
      </div>)}
      <button type="button" className="secondaire" onClick={ajouterTache}>Ajouter une tâche</button>{" "}<button>Enregistrer le modèle</button>
    </form>
    {message && <p className="message">{message}</p>}
    <h3>Modèles créés (démo)</h3>
    {modeles.length === 0 && <p>Aucun modèle créé.</p>}
    {modeles.map(m => <article key={m.code} className="modele"><strong>{m.code} — {m.nom}</strong><p>{m.taches.length} tâche(s), estimations uniquement.</p><button className="secondaire petit" onClick={() => supprimer(m)}>Supprimer avec confirmation</button></article>)}
    <p className="note">Prototype partiel : sous-tâches, duplication et intégration aux projets restent à réaliser avec le Backend.</p>
  </section>;
}

function FeuilleTemps() {
  const [tache, setTache] = useState("1");
  const [heures, setHeures] = useState("");
  const [jour, setJour] = useState("Lundi");
  const [lignes, setLignes] = useState([]);
  const [statut, setStatut] = useState("Brouillon");
  const [message, setMessage] = useState("");
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  function ajouter(e) {
    e.preventDefault();
    const h = Number(heures);
    if (statut !== "Brouillon") return setMessage("Feuille soumise : modification indisponible dans cette démo.");
    if (!heures || !Number.isFinite(h) || h <= 0 || h > 24) return setMessage("Entrez un nombre d'heures entre 0 et 24.");
    if (lignes.filter(l => l.jour === jour).reduce((s, l) => s + l.heures, 0) + h > 24) return setMessage("Maximum 24 h par jour.");
    const choix = tachesExemples.find(t => String(t.id) === tache);
    if (choix.statut === "Terminée") return setMessage("Impossible de saisir sur une tâche terminée.");
    setLignes([...lignes, { jour, tache: choix.nom, heures: h }]);
    setHeures(""); setMessage("Saisie fictive ajoutée.");
  }
  return <section className="carte"><h2>Feuille de temps hebdomadaire</h2>
    <p>Statut : <strong>{statut}</strong></p>
    <form onSubmit={ajouter} className="formulaire">
      <label>Jour<select value={jour} onChange={e => setJour(e.target.value)}>{jours.map(j => <option key={j}>{j}</option>)}</select></label>
      <label>Tâche<select value={tache} onChange={e => setTache(e.target.value)}>{tachesExemples.map(t => <option key={t.id} value={t.id}>{t.nom} ({t.statut})</option>)}</select></label>
      <label>Heures<input type="number" min="0.5" max="24" step="0.5" value={heures} onChange={e => setHeures(e.target.value)} /></label>
      <button disabled={statut !== "Brouillon"}>Ajouter</button>
    </form>
    {message && <p className="message">{message}</p>}
    <table><thead><tr><th>Jour</th><th>Tâche</th><th>Heures</th></tr></thead><tbody>
      {lignes.map((l, i) => <tr key={i}><td>{l.jour}</td><td>{l.tache}</td><td>{l.heures}</td></tr>)}
    </tbody></table>
    <p><strong>Total : {lignes.reduce((s, l) => s + l.heures, 0)} h</strong></p>
    <button disabled={statut !== "Brouillon" || lignes.length === 0} onClick={() => { setStatut("Soumise"); setMessage("Soumission fictive : aucune feuille envoyée au gestionnaire."); }}>Soumettre la feuille</button>
    <p className="note">L'approbation, le rejet avec motif et la correction après rejet nécessitent le Backend.</p>
  </section>;
}
