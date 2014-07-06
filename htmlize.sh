#!/bin/bash

INPUT=$(cat)

cat <<EOT
MIME-Version: 1.0
Subject: testing HTML email

--001a113a621c35e26104fd870f45
Content-Type: text/plain; charset=UTF-8
$INPUT

--001a113a621c35e26104fd870f45
Content-Type: text/html; charset=UTF-8
<pre>
$INPUT
</pre>

--001a113a621c35e26104fd870f45--
EOT
