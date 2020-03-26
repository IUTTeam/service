# PARTIE RECEPTION DES DONNÉES (du système embarqué):

envoyer au serveur à l'url : `NOM_SITE/send_data` et au port : `1234` (temporaire)

...une méthode POST dont le body contient un JSON du format suivant :


JSON
```
{
	"type":NOM_TYPE,
	"donnees":[
		[VALEUR_DONNEE_1, TIMESTAMP_PRISE_DONNEE_1],
		[VALEUR_DONNEE_1, TIMESTAMP_PRISE_DONNEE_2],
		...
		[VALEUR_DONNEE_N, TIMESTAMP_PRISE_DONNEE_N]
	]
}
```

Les timestamps sont des timestamps UNIX classiques (càd nombre de secondes depuis 1<sup>er</sup> Janvier 1970)
Pour le moment, une seule requête par type de données que l'on souhaite envoyer, si cela pose des contraintes à voir pour modifier l'architecture du JSON...

# PARTIE ENVOI DES DONNÉES (de l'application client):

envoyer au serveur à l'URL : `NOM_SITE/request_data` et au port : `1234`

...une méthode GET comprenant un parametre get : "donnees" dans l'url
donnees est une chaine de caractere représentant un JSON.

Ce JSON est de forme : 

JSON
```
{
	"type":NOM_TYPE,
	"intervalles":[
		[INTERVALLE_DEBUT_1, INTERVALLE_FIN_1],
		[INTERVALLE_DEBUT_2, INTERVALLE_FIN_2],
		...
		[INTERVALLE_DEBUT_N, INTERVALLE_FIN_N]		
	]
}
```

Pour le faire passer en chaine de caractere dans l'URL, il faut le stringifier et encoder les caracteres d'URL.
CàD, une fois que vous avez votre objet JS contenant le contenu ci-dessus, vous enverrez en paramètre GET : 
	encodeURIComponent(JSON.stringify(votreObjet));


La réponse est un JSON de format : 

JSON
```
{
	"statsGenerales":{
		"min":MIN_DONNEES_INTERVALLES,
		"max":MAX_DONNEES_INTERVALLES,
		"moyenne":MOYENNE_DONNEES_INTERVALLES,
		"nb":NB_DONNEES_INTERVALLES,
		"intervalleDebut":DEBUT_INTERVALLES,
		"intervalleFin":FIN_INTERVALLES
	}	
	"statsDonnees":[
		{
			"min":MIN_DONNEES_INTERVALLE_1,
			"max":MAX_DONNEES_INTERVALLE_1,
			"moyenne":MOYENNE_DONNEES_INTERVALLE_1,
			"nb":NB_DONNEES_INTERVALLE_1,
			"intervalleDebut":DEBUT_INTERVALLE_1,
			"intervalleFin":FIN_INTERVALLE_1
		},
		{
			"min":MIN_DONNEES_INTERVALLE_2,
			"max":MAX_DONNEES_INTERVALLE_2,
			"moyenne":MOYENNE_DONNEES_INTERVALLE_2,
			"nb":NB_DONNEES_INTERVALLE_2,
			"intervalleDebut":DEBUT_INTERVALLE_2,
			"intervalleFin":FIN_INTERVALLE_2
		},
	],
}
```


Pour recevoir tous les types :
envoyer une requête (méthode GET) à l'URL : `NOM_SITE/get_types`

La réponse est un JSON de format :

JSON
```
{
	"types":[
		NOM_TYPE_1,
		NOM_TYPE_2,
		...
		NOM_TYPE_N
	]
}
```
