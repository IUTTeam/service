const consts = require('./Consts');

exports.ajouterDonnee = async function(connexionSQL, nomType, valeur, date) {
  await connexionSQL.query("INSERT INTO " + nomType + "(" + 
      consts.ATTRIBUT_DONNEE_VALEUR + ", " + 
      consts.ATTRIBUT_DONNEE_DATE + 
      ") VALUES (" + valeur + ", " + date + ")");
  return consts.RETOUR_DONNEE_AJOUTEE;
};

exports.getDonneesDeTypeIntervalle = async function(connexionSQL, nomType, intervalleDebut, intervalleFin) {
  	const results = await connexionSQL.query("SELECT " + consts.ATTRIBUT_DONNEE_VALEUR + ", " + consts.ATTRIBUT_DONNEE_DATE + " FROM " + nomType + " WHERE " + consts.ATTRIBUT_DONNEE_DATE + " >= " + intervalleDebut + " AND " + consts.ATTRIBUT_DONNEE_DATE + " <= " + intervalleFin + ";");
  	return results;
}