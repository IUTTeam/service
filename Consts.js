exports.TABLE_TYPES = "types";

exports.ATTRIBUT_DONNEE_ID = "id";
exports.ATTRIBUT_DONNEE_VALEUR = "valeur";
exports.ATTRIBUT_DONNEE_DATE = "date";

exports.ATTRIBUT_TYPE_ID = "id";
exports.ATTRIBUT_TYPE_NOM = "nom";

exports.PROTOCOLE = "http://";
exports.HOTE = "localhost";
exports.PORT = 1234;

exports.HOTE_BASE_DE_DONNEES = "frfr.duckdns.org";
exports.UTILISATEUR_BASE_DE_DONNEES = "root";
exports.MOT_DE_PASSE_BASE_DE_DONNEES = "example";
exports.BASE_DE_DONNEES = "BDD_iutteam";
exports.LIMITE_CONNEXIONS_SIMULTANNEES = 1000;

exports.URL_ENVOYER_DONNEES_SERVEUR = "/send_data";
exports.URL_RECEVOIR_DONNEES_SERVEUR = "/request_data";
exports.URL_RECEVOIR_TYPES_SERVEUR = "/get_types";

exports.URL_GET_DONNEES = "donnees";
exports.URL_GET_TYPE = "type";
exports.URL_GET_INTERVALLES = "intervalles";
exports.URL_GET_INTERVALLE_DEBUT = "intervalleDebut";
exports.URL_GET_INTERVALLE_FIN = "intervalleFin";

exports.REQUETE_METHODE_POST = "POST";
exports.REQUETE_METHODE_GET = "GET";

exports.STAT_MIN = "min";
exports.STAT_MAX = "max";
exports.STAT_MOYENNE = "moyenne";
exports.STAT_NOMBRE = "nb";
exports.STAT_INTERVALLE_DEBUT = "intervalleDebut";
exports.STAT_INTERVALLE_FIN = "intervalleFin";

exports.TYPE_CONTENU = "Content-type";
exports.CONTENU_TEXTE = "text/plain";

exports.REQUETE_CLE_TYPE = "type";
exports.REQUETE_CLE_DATE = "date";
exports.REQUETE_CLE_VALEUR = "valeur";

exports.EVENEMENT_DONNEES = "data";
exports.EVENEMENT_FIN_TRANSMISSION = "end";

exports.ERREUR_PREFIXE = "Erreur : ";
exports.ERREUR_REQUETE_INCORRECT = "format de requête incorrect";
exports.ERREUR_REQUETE_RESSOURCE_NON_TROUVEE = "la ressource recherchée n'a pas été trouvée";
exports.ERREUR_CONNEXION_PERDUE = "la connexion à la base de donnée a été perdue";
exports.ERREUR_SURPLUS_CONNEXION = "trop de connexions simultanées";
exports.ERREUR_CONNEXION_REFUSEE = "connexion refusée";

exports.RETOUR_SERVEUR_OPERATIONNEL = "Le serveur est opérationnel";
exports.RETOUR_PAGE_ACCUEIL = "Page d'accueil";
exports.RETOUR_DONNEE_AJOUTEE = "Donnée ajoutée";

exports.CODE_REPONSE_CORRECT = 200;
exports.CODE_REPONSE_MAUVAISE_REQUETE = 400;
exports.CODE_REPONSE_RESSOURCE_NON_TROUVEE = 404;

exports.CODE_ERREUR_CONNEXION_PERDUE = "PROTOCOL_CONNECTION_LOST";
exports.CODE_ERREUR_SURPLUS_CONNEXION = "ER_CON_COUNT_ERROR";
exports.CODE_ERREUR_CONNEXION_REFUSEE = "ECONNREFUSED";
