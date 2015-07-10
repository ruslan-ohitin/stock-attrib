bin/keywords.zip: bin/keywords/keywords.js bin/keywords/put-iptc.hta
	if [ -e bin/keywords-3.zip ]; then rm bin/keywords-3.zip; fi
	if [ -e bin/keywords-2.zip ]; then mv bin/keywords-2.zip bin/keywords-3.zip; fi
	if [ -e bin/keywords.zip ];   then mv bin/keywords.zip bin/keywords-2.zip; fi
	7za a -tzip bin/keywords.zip ./bin/keywords/*

bin/keywords/keywords.js: keywords.js
	iconv -f UTF-8 -t CP1251 < keywords.js > bin/keywords/keywords.js

bin/keywords/put-iptc.hta: put-iptc.hta
	iconv -f UTF-8 -t CP1251 < put-iptc.hta > bin/keywords/put-iptc.hta
