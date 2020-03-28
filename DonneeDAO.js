const consts = require('./Consts');

exports.ajouterDonnee = async function(connexionSQL, type, unite, valeur, date) {
  await connexionSQL.query("INSERT INTO `" + type + "-" + unite + "` (" + 
      consts.ATTRIBUT_DONNEE_VALEUR + ", " + 
      consts.ATTRIBUT_DONNEE_DATE + 
      ") VALUES (" + valeur + ", " + date + ")");
  return consts.RETOUR_DONNEE_AJOUTEE;
};

exports.getStatistiquesDeTypeIntervalle = async function(connexionSQL, type, unite, intervalleDebut, intervalleFin) {
	let stats = (await connexionSQL.query("SELECT " +
		"MIN(" + consts.ATTRIBUT_DONNEE_VALEUR + ") AS " + consts.STAT_MIN +
		", MAX(" + consts.ATTRIBUT_DONNEE_VALEUR + ") AS " + consts.STAT_MAX +
		", AVG(" + consts.ATTRIBUT_DONNEE_VALEUR + ") AS " + consts.STAT_MOYENNE +
		", COUNT(" + consts.ATTRIBUT_DONNEE_ID + ") AS " + consts.STAT_NOMBRE +
		" FROM `" + type + "-" + unite + "`" + 
		" WHERE " + consts.ATTRIBUT_DONNEE_DATE + " >= " + intervalleDebut + " AND " + consts.ATTRIBUT_DONNEE_DATE + " <= " + intervalleFin + ";"))[0];
	stats.intervalleDebut = intervalleDebut;
	stats.intervalleFin = intervalleFin;
	return stats;
}