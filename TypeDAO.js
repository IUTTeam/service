const consts = require('./Consts');

exports.typeExiste = async function(connexionSQL, nomType) {
  const res = await connexionSQL.query("SELECT * FROM " + consts.TABLE_TYPES + " WHERE " + consts.ATTRIBUT_TYPE_NOM + " = \"" + nomType + "\";");
  return res.length > 0;
}

exports.getTypes = async function(connexionSQL) {
	const types = await connexionSQL.query("SELECT " + consts.ATTRIBUT_TYPE_NOM + " FROM " + consts.TABLE_TYPES + ";");
	return types;
}

exports.ajouterType = async function(connexionSQL, nomType) { 
  await Promise.all([connexionSQL.query("INSERT INTO " + consts.TABLE_TYPES + "(" + consts.ATTRIBUT_TYPE_NOM + ") VALUES ('" + nomType + "');"),
    connexionSQL.query("CREATE TABLE " + nomType + " (" + consts.ATTRIBUT_DONNEE_ID + " INTEGER PRIMARY KEY AUTO_INCREMENT, " + consts.ATTRIBUT_DONNEE_VALEUR + " INTEGER, " + consts.ATTRIBUT_DONNEE_DATE + " INTEGER);")]);
};

exports.supprimerType = async function(connexionSQL, nomType) {
  await Promise.all([connexionSQL.query("DROP TABLE " + nomType + ";"),
    connexionSQL.query("REMOVE FROM " + consts.TABLE_TYPES + " WHERE " + consts.ATTRIBUT_TYPE_NOM + " = \"" + nomType + "\";")]);
}