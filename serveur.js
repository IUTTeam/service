const http = require('http');
const mysql = require('mysql');
const util = require('util');
const URL = require('url').URL;
const donneesDAO = require('./DonneeDAO');
const typeDAO = require('./TypeDAO');
const consts = require('./Consts');

let traiteurRequetes = async function(requete,reponse)
{
	let txtReponse = "";
	let codeReponse = 200;
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

    let envoyerReponse = function(retour) {
        reponse.statusCode = retour.codeReponse;
    	reponse.setHeader('Content-type', 'text/plain');
    	reponse.end(retour.reponse); 	
    }

    await fonctionUtilisee(requete, envoyerReponse);
}

let envoyerDonneeAuServeur = async function(requete, callback) {
	let mauvaiseRequete = false;

	const connexionSQL = getConnexionSQL();

    if (requete.method === REQUETE_METHODE_POST) {
    	let donneesPost = '';
    	requete.on('data', function(partie) {
        	donneesPost += partie.toString();

    	});
    	requete.on('end', async function() {
    		try {
	    		donneesPost = JSON.parse(donneesPost);
	    		let type = donneesPost.type;
	    		let donnees = donneesPost.donnees;
		        const typeExiste = await typeDAO.typeExiste(connexionSQL, type);
		        if (!typeExiste) {
		        	await typeDAO.ajouterType(connexionSQL, type);
		        }
	    		for (let i = 0;i<donnees.length;i++) {
	    			let valeurCourante = donnees[i][0];
	    			let dateCourante = donnees[i][1];
	    			donneesDAO.ajouterDonnee(connexionSQL, type, valeurCourante, dateCourante);
	    		}
    		}
    		catch (error) {
    			console.log(error);
				callback({
					"reponse" : consts.ERREUR_REQUETE_INCORRECT,
					"codeReponse" : consts.CODE_REPONSE_MAUVAISE_REQUETE,
				});
			}
    		if (!mauvaiseRequete) {
	    		callback({
					"reponse" : "OK",
					"codeReponse" : consts.CODE_REPONSE_CORRECT,
				});
    		}
    	});
    }
    else {
    	console.log(requete.method);
		callback({
			"reponse" : consts.ERREUR_REQUETE_INCORRECT,
			"codeReponse" : consts.CODE_REPONSE_MAUVAISE_REQUETE,
		});
	}
}

let recevoirDonneeDeServeur = async function(requete, callback) {
	const connexionSQL = getConnexionSQL();
	if (requete.method === consts.REQUETE_METHODE_GET) {
		const requeteURL = new URL(consts.PROTOCOLE + requete.headers.host + requete.url);
		const type = requeteURL.searchParams.get("type");
		const temponDebut = parseInt(requeteURL.searchParams.get("temponDebut"));
		const temponFin = parseInt(requeteURL.searchParams.get("temponFin"));
		if (type !== null && temponDebut !== null && temponFin !== null) {
			let donnees = await donneesDAO.getDonneesDeTypeIntervalle(connexionSQL, type, temponDebut, temponFin);
			let json = {};
			json.type = type;
			json.donnees = [];
			donnees.forEach(function(donnee) {
				json.donnees.push([donnee.valeur, donnee.date]);
			});
			callback({
				"reponse" : JSON.stringify(json),
				"codeReponse" : consts.CODE_REPONSE_CORRECT,
			});			
		}
		else {
			callback({
				"reponse" : consts.ERREUR_REQUETE_INCORRECT,
				"codeReponse" : consts.CODE_REPONSE_MAUVAISE_REQUETE,
			});
		}
	}
	else {
		callback({
			"reponse" : consts.ERREUR_REQUETE_INCORRECT,
			"codeReponse" : consts.CODE_REPONSE_MAUVAISE_REQUETE,
		});	
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
			"reponse" : JSON.stringify(json),
			"codeReponse" : consts.CODE_REPONSE_CORRECT,
		});
	}
	else {
		callback({
			"reponse" : consts.ERREUR_REQUETE_INCORRECT,
			"codeReponse" : consts.CODE_REPONSE_MAUVAISE_REQUETE,
		});		
	}
}

let requeteParDefaut = function(requete, callback) {
	callback({
		"reponse" : consts.RETOUR_PAGE_ACCUEIL,
		"codeReponse" : consts.CODE_REPONSE_CORRECT,
	});
}

let getConnexionSQL = function() {
	const pool = mysql.createPool({
	  connectionLimit: consts.LIMITE_CONNEXIONS_SIMULTANNEES,
	  host: consts.HOTE_BASE_DE_DONNEES,
	  user: consts.UTILISATEUR_BASE_DE_DONNEES,
	  password: consts.MOT_DE_PASSE_BASE_DE_DONNEES,
	  database: consts.BASE_DE_DONNEES,
	})

	pool.getConnection((err, connection) => {
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