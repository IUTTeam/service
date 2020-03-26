const consts = require('./Consts');

exports.ajouterDonnee = async function(connexionSQL, nomType, valeur, date) {
  await connexionSQL.query("INSERT INTO " + nomType + "(" + 
      consts.ATTRIBUT_DONNEE_VALEUR + ", " + 
      consts.ATTRIBUT_DONNEE_DATE + 
      ") VALUES (" + valeur + ", " + date + ")");
  return consts.RETOUR_DONNEE_AJOUTEE;
};

exports.getStatistiquesDeTypeIntervalle = async function(connexionSQL, nomType, intervalleDebut, intervalleFin) {
	let stats = (await connexionSQL.query("SELECT MIN(" + consts.ATTRIBUT_DONNEE_VALEUR + ") AS " + consts.STAT_MIN +
		", MAX(" + consts.ATTRIBUT_DONNEE_VALEUR + ") AS " + consts.STAT_MAX +
		", AVG(" + consts.ATTRIBUT_DONNEE_VALEUR + ") AS " + consts.STAT_MOYENNE +
		", COUNT(" + consts.ATTRIBUT_DONNEE_ID + ") AS " + consts.STAT_NOMBRE +
		" FROM " + nomType +
		" WHERE " + consts.ATTRIBUT_DONNEE_DATE + " >= " + intervalleDebut + " AND " + consts.ATTRIBUT_DONNEE_DATE + " <= " + intervalleFin + ";"))[0];
	stats.intervalleDebut = intervalleDebut;
	stats.intervalleFin = intervalleFin;
	return stats;
}