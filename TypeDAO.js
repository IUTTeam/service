const consts = require('./Consts');

exports.typeExiste = async function(connexionSQL, type, unite) {
  const res = await connexionSQL.query("SELECT * FROM `" + consts.TABLE_TYPES + "`" + 
  	" WHERE " + consts.ATTRIBUT_TYPE_NOM + " = \"" + type + "\" AND " + consts.ATTRIBUT_TYPE_UNITE + " = \"" + unite + "\";");
  return res.length > 0;
}

exports.getTypes = async function(connexionSQL) {
	const types = await connexionSQL.query("SELECT " + consts.ATTRIBUT_TYPE_NOM + ", " + consts.ATTRIBUT_TYPE_UNITE + " FROM `" + consts.TABLE_TYPES + "` ;");
	return types;
}

exports.ajouterType = async function(connexionSQL, type, unite) { 
  await Promise.all([connexionSQL.query("INSERT INTO `" + consts.TABLE_TYPES + "` (" + consts.ATTRIBUT_TYPE_NOM + ", " + consts.ATTRIBUT_TYPE_UNITE +") VALUES ('" + type + "', '" + unite +"');"),
    connexionSQL.query("CREATE TABLE `" + type + "-" + unite + "` (" + consts.ATTRIBUT_DONNEE_ID + " INTEGER PRIMARY KEY AUTO_INCREMENT, " + consts.ATTRIBUT_DONNEE_VALEUR + " FLOAT(10,4), " + consts.ATTRIBUT_DONNEE_DATE + " INTEGER);"),]);
};

exports.supprimerType = async function(connexionSQL, type, unite) {
  await Promise.all([connexionSQL.query("DROP TABLE " + type + "-" + unite + ";"),
    connexionSQL.query("REMOVE FROM `" + consts.TABLE_TYPES + "` WHERE " + consts.ATTRIBUT_TYPE_NOM + " = \"" + type + "\" AND " + consts.ATTRIBUT_TYPE_UNITE + " = \"" + unite + "\";")]);
}