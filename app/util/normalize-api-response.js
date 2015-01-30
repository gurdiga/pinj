'use strict';

module.exports = normalizeAPIResponse;

function normalizeAPIResponse(url, form, resolve) {
  return function(err, res, body) {
    if (err) console.error(err, url, form);

    res = res || { statusCode: -1 };
    if (res.statusCode !== 200) console.error('HTTP', res.statusCode, url, form);

    resolve(prepareBody(body));
  };
}

function prepareBody(body) {
  var emptyBody = { rows: [] };

  body = body || emptyBody;
  body.rows = body.rows || emptyBody.rows;

  return body;
}
