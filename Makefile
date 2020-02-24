# Auxiliary Makefile to help build resource from dict-view

OUT_DIR = resource
SRC_DIR = dict-view

# parcel configuration options
common_options = --target "browser" --out-dir $(OUT_DIR) --public-url "./" 
build_options  = build $(common_options) --no-content-hash --detailed-report 10
watch_options  = $(common_options)

# TARGETS
dict.js = $(OUT_DIR)/dict.js
template.html = $(OUT_DIR)/template.html

.PHONY:all
all: $(template.html) #$(dict.js)


$(template.html) $(dict.js): $(SRC_DIR)/template.html $(SRC_DIR)/dict.js $(SRC_DIR)/dict.css
	parcel $(build_options) $< 

.PHONY: watch
watch: template.html dict.js dict.css
	parcel $(watch_options) $<


.PHONY: clean
clean:
	rm -rf $(OUT_DIR)
	rm -f parcel-debug* 
	rm -rfv .cache