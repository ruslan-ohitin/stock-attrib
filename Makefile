bin/work-is-done.txt: keywords.js put-iptc.hta
	iconv -f UTF-8 -t CP1251 < keywords.js > bin/keywords.js
	iconv -f UTF-8 -t CP1251 < put-iptc.hta > bin/put-iptc.hta
	echo "Done!" > bin/work-is-done.txt
