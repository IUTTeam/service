exports.TABLE_TYPES = "types";

exports.ATTRIBUT_DONNEE_ID = "id";
exports.ATTRIBUT_DONNEE_VALEUR = "valeur";
exports.ATTRIBUT_DONNEE_DATE = "date";

exports.ATTRIBUT_TYPE_ID = "id";
exports.ATTRIBUT_TYPE_NOM = "nom";

exports.PROTOCOLE = "http://";
exports.HOTE = "localhost";
exports.PORT = 1234;

exports.HOTE_BASE_DE_DONNEES = "serveurmysql";
exports.UTILISATEUR_BASE_DE_DONNEES = "bboulle";
exports.MOT_DE_PASSE_BASE_DE_DONNEES = "2511";
exports.BASE_DE_DONNEES = "BDD_bboulle";
exports.LIMITE_CONNEXIONS_SIMULTANNEES = 10;

exports.URL_ENVOYER_SERVEUR = "/send_data";
exports.URL_RECEVOIR_SERVEUR = "/request_data";
exports.URL_RECEVOIR_TYPES_SERVEUR = "/get_types";

exports.REQUETE_METHODE_POST = "POST";
exports.REQUETE_METHODE_GET = "GET";


exports.REQUETE_CLE_TYPE = "type";
exports.REQUETE_CLE_DATE = "date";
exports.REQUETE_CLE_VALEUR = "valeur";

exports.ERREUR_PREFIXE = "Erreur : ";
exports.ERREUR_REQUETE_INCORRECT = "format de requête incorrect";
exports.ERREUR_CONNEXION_PERDUE = "la connexion à la base de donnée a été perdue";
exports.ERREUR_SURPLUS_CONNEXION = "trop de connexions simultannées";
exports.ERREUR_CONNEXION_REFUSEE = "connexion refusée";

exports.RETOUR_SERVEUR_OPERATIONNEL = "Le serveur est opérationnel";
exports.RETOUR_PAGE_ACCUEIL = "Page d'accueil";
exports.RETOUR_DONNEE_AJOUTEE = "Donnée ajoutée";

exports.CODE_REPONSE_CORRECT = 200;
exports.CODE_REPONSE_MAUVAISE_REQUETE = 400;

exports.CODE_ERREUR_CONNEXION_PERDUE = "PROTOCOL_CONNECTION_LOST";
exports.CODE_ERREUR_SURPLUS_CONNEXION = "ER_CON_COUNT_ERROR";
exports.CODE_ERREUR_CONNEXION_REFUSEE = "ECONNREFUSED";