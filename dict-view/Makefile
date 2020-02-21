# Auxiliary Makefile to help build resource from dict-view

OUT_DIR = ../resource
SRC_DIR = dict-view
# parcel configuration options
options = build --target "browser" --out-dir $(OUT_DIR) --public-url "./" --no-content-hash --detailed-report 10 --log-level 5

watch_option = --target "browser" --out-dir $(OUT_DIR) --public-url "./" 

# TARGETS
dict.js = $(OUT_DIR)/dict.js
template.html = $(OUT_DIR)/template.html

$(template.html) $(dict.js): template.html dict.js dict.css
	parcel $(options) $< 

.PHONY: watch
watch: template.html dict.js dict.css
	parcel $(watch_option) $<


.PHONY: clean
clean:
	rm -rf $(OUT_DIR)
	rm -f parcel-debug* 
	rm -rfv .cache