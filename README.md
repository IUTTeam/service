/////////////////////////////////////////////////////////
/////PARTIE RECEPTION DES DONNÉES (du système embarqué):
/////////////////////////////////////////////////////////

envoyer au serveur à l'url : NOM_SITE/send_data et au port : 1234 (temporaire)

...une méthode POST dont le body contient un JSON du format suivant :
{
	"type":NOM_TYPE,
	"donnees":[
		[VALEUR_DONNEE_1, TIMESTAMP_PRISE_DONNEE_1],
		[VALEUR_DONNEE_1, TIMESTAMP_PRISE_DONNEE_2],
		...
		[VALEUR_DONNEE_N, TIMESTAMP_PRISE_DONNEE_N]
	]
}

Les timestamps sont des timestamps UNIX classiques (càd nombre de secondes depuis 1er Janvier 1970)
Pour le moment, une seul requête par type de données que l'on souhaite envoyer, si cela pose des contraintes à voir pour modifier l'architecture du JSON...

/////////////////////////////////////////////////////////
/////PARTIE ENVOI DES DONNÉES (de l'application client):
/////////////////////////////////////////////////////////

envoyer au serveur à l'url : NOM_SITE/request_data et au port : 1234

...une méthode GET présisant le type de la donnée recherchée, et par 2 timestamps l'intervalle désirée. Les clés correspondantes sont "type", "temponDebut", "temponFin"
ex : NOM_SITE/request_from_server?type=temperature&temponDebut=0&temponFin=2500

La réponse est un JSON de format (même format que réception des données) : 

{
	"type":NOM_TYPE,
	"donnees":[
		[VALEUR_DONNEE_1, TIMESTAMP_PRISE_DONNEE_1],
		[VALEUR_DONNEE_1, TIMESTAMP_PRISE_DONNEE_2],
		...
		[VALEUR_DONNEE_N, TIMESTAMP_PRISE_DONNEE_N]
	]
}

/////////////////////////////////////////////////////////

Pour recevoir tous les types :
envoyer une requête (méthode GET) à l'url : NOM_SITE/get_types

La réponse est un JSON de format :
{
	types:[
		NOM_TYPE_1,
		NOM_TYPE_2,
		...
		NOM_TYPE_N
	]
}