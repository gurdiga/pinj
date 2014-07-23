'use strict';

var Courts = {};

Courts.getIds = function() {
  var _ = require('underscore');

  return _(list).keys();
};

Courts.getName = function(courtId) {
  return list[courtId];
};

var list = {
  'cac': 'Curtea de Apel Chişinău',
  'jb': 'Judecătoria Botanica',
  'jbu': 'Judecătoria Buiucani',
  'jci': 'Judecătoria Ciocana',
  'jcc': 'Judecătoria Centru',
  'jrc': 'Judecătoria Rîşcani',
  'jbs': 'Judecătoria Basarabeasca',
  'jcl': 'Judecătoria Călăraşi',
  'jcm': 'Judecătoria Cimişlia',
  'jcr': 'Judecătoria Criuleni',
  'jhn': 'Judecătoria Hînceşti',
  'jia': 'Judecătoria Ialoveni',
  'jns': 'Judecătoria Nisporeni',
  'jor': 'Judecătoria Orhei',
  'jrz': 'Judecătoria Rezina',
  'jst': 'Judecătoria Străşeni',
  'jm': 'Judecătoria Militară',
  'je': 'Judecătoria Comercială',
  'cab': 'Curtea de Apel Bălţi',
  'jba': 'Judecătoria Bălţi',
  'jbr': 'Judecătoria Breiceni',
  'jdn': 'Judecătoria Donduşeni',
  'jdr': 'Judecătoria Drochia',
  'jed': 'Judecătoria Edineţ',
  'jfa': 'Judecătoria Făleşti',
  'jfl': 'Judecătoria Floreşti',
  'jgl': 'Judecătoria Glodeni',
  'joc': 'Judecătoria Ocniţa',
  'jrsr': 'Judecătoria Rîşcani',
  'jsi': 'Judecătoria Sîngerei',
  'jsr': 'Judecătoria Soroca',
  'jsd': 'Judecătoria Şoldăneşti',
  'jtl': 'Judecătoria Teleneşti',
  'jun': 'Judecătoria Ungheni',
  'cabe': 'Curtea de Apel Bender',
  'jbe': 'Judecătoria Bender',
  'jan': 'Judecătoria Anenii-Noi',
  'jca': 'Judecătoria Căuşeni',
  'jdb': 'Judecătoria Dubăsari',
  'jgr': 'Judecătoria Grigoriopol',
  'jrb': 'Judecătoria Rîbniţa',
  'jslb': 'Judecătoria Slobozia',
  'jsv': 'Judecătoria Ştefan-Vodă',
  'cach': 'Curtea de Apel Cahul',
  'jch': 'Judecătoria Cahul',
  'jct': 'Judecătoria Cantemir',
  'jlv': 'Judecătoria Leova',
  'jt': 'Judecătoria Taraclia',
  'caco': 'Curtea de Apel Comrat',
  'jco': 'Judecătoria Comrat',
  'jcg': 'Judecătoria Ceadîr-Lunga',
  'jvl': 'Judecătoria Vulcăneşti'
};

module.exports = Courts;
