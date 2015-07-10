bin/keywords/work-is-done.txt: bin/keywords/keywords.js bin/keywords/put-iptc.hta
	git log > bin/keywords/work-is-done.txt

bin/keywords/keywords.js: keywords.js
	iconv -f UTF-8 -t CP1251 < keywords.js > bin/keywords/keywords.js

bin/keywords/put-iptc.hta: put-iptc.hta
	iconv -f UTF-8 -t CP1251 < put-iptc.hta > bin/keywords/put-iptc.hta
