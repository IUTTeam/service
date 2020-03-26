const http = require("http");
const mysql = require("mysql");
const util = require("util");
const URL = require("url").URL;
const donneesDAO = require("./DonneeDAO");
const typeDAO = require("./TypeDAO");
const consts = require("./Consts");

let traiteurRequetes = async function(requete,reponse)
{
	let txtReponse = "";
	let codeReponse = consts.CODE_REPONSE_CORRECT;
	const requeteURL = new URL(consts.PROTOCOLE + requete.headers.host + requete.url);
	let fonctionUtilisee = null;
    switch (requeteURL.pathname) {
    	case consts.URL_ENVOYER_DONNEES_SERVEUR:
    		fonctionUtilisee = envoyerDonneeAuServeur;
    		break;
        case consts.URL_RECEVOIR_DONNEES_SERVEUR:
        	fonctionUtilisee = recevoirDonneeDeServeur;
        	break;
        case consts.URL_RECEVOIR_TYPES_SERVEUR:
        	fonctionUtilisee = recevoirTypesDeServeur;
        	break;
        default:
        	fonctionUtilisee = requeteParDefaut;
        	break;
    }

    let envoyerReponse = function(retour, connexionSQL) {
        reponse.statusCode = retour.codeReponse;
    	reponse.setHeader(consts.TYPE_CONTENU, consts.CONTENU_TEXTE);
    	reponse.end(retour.reponse);
    	if (connexionSQL !== null) {
    		connexionSQL.end();    		
    	}
    }

    await fonctionUtilisee(requete, envoyerReponse);
}

let envoyerDonneeAuServeur = async function(requete, callback) {
	let mauvaiseRequete = false;

	const connexionSQL = getConnexionSQL();

    if (requete.method === consts.REQUETE_METHODE_POST) {
    	let donneesPost = "";
    	requete.on(consts.EVENEMENT_DONNEES, function(partie) {
        	donneesPost += partie.toString();

    	});
    	requete.on(consts.EVENEMENT_FIN_TRANSMISSION, async function() {
    		try {
	    		donneesPost = JSON.parse(donneesPost);
	    		let type = donneesPost.type;
	    		let donnees = donneesPost.donnees;
		        const typeExiste = await typeDAO.typeExiste(connexionSQL, type);
		        if (!typeExiste) {
		        	await typeDAO.ajouterType(connexionSQL, type);
		        }

		        let requetes = [];
	    		for (let i = 0; i < donnees.length; i += 1) {
	    			let valeurCourante = donnees[i][0];
	    			let dateCourante = donnees[i][1];
	    			requetes.push(donneesDAO.ajouterDonnee(connexionSQL, type, valeurCourante, dateCourante));
	    		}
	    		await Promise.all(requetes);
    		}
    		catch (error) {
    			console.log(error);
    			mauvaiseRequete = true;
				callback({
					reponse : consts.ERREUR_REQUETE_INCORRECT,
					codeReponse : consts.CODE_REPONSE_MAUVAISE_REQUETE,
				}, connexionSQL);
			}
    		if (!mauvaiseRequete) {
	    		callback({
					reponse : consts.RETOUR_DONNEE_AJOUTEE,
					codeReponse : consts.CODE_REPONSE_CORRECT,
				}, connexionSQL);
    		}
    	});
    }
    else {
		callback({
			reponse : consts.ERREUR_REQUETE_INCORRECT,
			codeReponse : consts.CODE_REPONSE_MAUVAISE_REQUETE,
		}, connexionSQL);
	}
}

let recevoirDonneeDeServeur = async function(requete, callback) {
	const connexionSQL = getConnexionSQL();
	if (requete.method === consts.REQUETE_METHODE_GET) {
		const requeteURL = new URL(consts.PROTOCOLE + requete.headers.host + requete.url);
		const donneesGet = JSON.parse(decodeURIComponent(requeteURL.searchParams.get(consts.URL_GET_DONNEES)));
		if (donneesGet !== null) {
			let type = donneesGet[consts.URL_GET_TYPE];
			let intervalles = donneesGet[consts.URL_GET_INTERVALLES];
			let requetes = [];

			let typeExiste = await typeDAO.typeExiste(connexionSQL, type); 

			if (typeExiste) {
				// Permet de traiter chaque requete dans un thread different
				intervalles.forEach(async function(intervalle) {
					requetes.push(donneesDAO.getStatistiquesDeTypeIntervalle(connexionSQL, type, intervalle[0], intervalle[1]));
				});

				let stats = await Promise.all(requetes);

				let min = NaN;
				let max = NaN;
				let moyenne = NaN;
				let sommeMoyennes = 0;
				let nbValeurs = 0;
				let intervalleDebut = NaN;
				let intervalleFin = NaN;


				let retour = {};
				retour.statsDonnees = [];

				stats.forEach(function(stat) {

					if (isNaN(min) || stat.min < min) {
						min = stat.min;
					}
					if (isNaN(max) || stat.max > max) {
						max = stat.max;
					}
					if (isNaN(intervalleDebut) || stat.intervalleDebut < intervalleDebut) {
						intervalleDebut = stat.intervalleDebut;
					}
					if (isNaN(intervalleFin) || stat.intervalleFin > intervalleFin) {
						intervalleFin = stat.intervalleFin;
					}					

					sommeMoyennes += stat.moyenne * stat.nb;
					nbValeurs += stat.nb;

					retour.statsDonnees.push(stat);

				});

				if (nbValeurs > 0) {
					moyenne = sommeMoyennes / nbValeurs;
				}

				retour.statsGenerales = {};
				retour.statsGenerales[consts.STAT_MIN] = min;
				retour.statsGenerales[consts.STAT_MAX] = max;
				retour.statsGenerales[consts.STAT_MOYENNE] = moyenne;
				retour.statsGenerales[consts.STAT_NOMBRE] = nbValeurs;
				retour.statsGenerales[consts.STAT_INTERVALLE_DEBUT] = intervalleDebut;
				retour.statsGenerales[consts.STAT_INTERVALLE_FIN] = intervalleFin;

				callback({
					reponse : JSON.stringify(retour),
					codeReponse : consts.CODE_REPONSE_CORRECT,
				}, connexionSQL);
			}
			else {
				callback({
					reponse : consts.ERREUR_REQUETE_RESSOURCE_NON_TROUVEE,
					codeReponse : consts.CODE_REPONSE_RESSOURCE_NON_TROUVEE,
				}, connexionSQL);
			}

		}
		else {
			callback({
				reponse : consts.ERREUR_REQUETE_INCORRECT,
				codeReponse : consts.CODE_REPONSE_MAUVAISE_REQUETE,
			}, connexionSQL);
		}
	}
	else {
		callback({
			reponse : consts.ERREUR_REQUETE_INCORRECT,
			codeReponse : consts.CODE_REPONSE_MAUVAISE_REQUETE,
		}, connexionSQL);
	}
}

let recevoirTypesDeServeur = async function(requete, callback) {
	const connexionSQL = getConnexionSQL();
	if (requete.method === consts.REQUETE_METHODE_GET) {
		const requeteURL = new URL(consts.PROTOCOLE + requete.headers.host + requete.url);
		const types = await typeDAO.getTypes(connexionSQL);
		let json = {};
		json.types = [];
		types.forEach(function(type) {
			json.types.push(type[consts.ATTRIBUT_TYPE_NOM]);
		});
		callback({
			reponse : JSON.stringify(json),
			codeReponse : consts.CODE_REPONSE_CORRECT,
		}, connexionSQL);
	}
	else {
		callback({
			reponse : consts.ERREUR_REQUETE_INCORRECT,
			codeReponse : consts.CODE_REPONSE_MAUVAISE_REQUETE,
		}, connexionSQL);
	}
}

let requeteParDefaut = function(requete, callback) {
	callback({
		reponse : consts.RETOUR_PAGE_ACCUEIL,
		codeReponse : consts.CODE_REPONSE_CORRECT,
	}, null);
}

let getConnexionSQL = function() {
	const pool = mysql.createPool({
	  connectionLimit: consts.LIMITE_CONNEXIONS_SIMULTANNEES,
	  host: consts.HOTE_BASE_DE_DONNEES,
	  user: consts.UTILISATEUR_BASE_DE_DONNEES,
	  password: consts.MOT_DE_PASSE_BASE_DE_DONNEES,
	  database: consts.BASE_DE_DONNEES,
	})

	pool.getConnection(function(err, connection) {
		if (err) {
			if (err.code === consts.ERREUR_CONNEXION_PERDUE) {
				console.log(consts.ERREUR_PREFIXE + CODE_ERREUR_CONNEXION_PERDUE);
			}
			if (err.code === consts.ERREUR_SURPLUS_CONNEXION) {
				console.log(consts.ERREUR_PREFIXE + CODE_ERREUR_SURPLUS_CONNEXION);
			}
			if (err.code === consts.ERREUR_CONNEXION_REFUSEE) {
				console.log(consts.ERREUR_PREFIXE + CODE_ERREUR_CONNEXION_REFUSEE);
			}
		}

	  if (connection) {
		connection.release();
	  }
	});

	pool.query = util.promisify(pool.query);
	return pool;
}

let serveur = http.createServer(traiteurRequetes);
serveur.listen(consts.PORT, consts.HOTE, function() {
	console.log(consts.RETOUR_SERVEUR_OPERATIONNEL);
});
