RESOURCE  =RESOURCE
DICT_VIEW =dict-view
TS_SRC    =$(wildcard src/*.ts)
TS_TEST   =$(wildcard src/tests/*.ts)
PEER_DEP  =wikinary-eintopf@file://../wikinary-eintopf



.PHONY:all
all: resource install package



.PHONY:resource 
resource:
	$(MAKE) -C $(DICT_VIEW) all

.PHONY:install
install:
	npm install --no-optional
	npm install --no-save $(PEER_DEP)

.PHONY:compile
compile: $(TS_SRC) tsconfig.json
	tsc -p ./

.PHONY:package
package: resource install
	vsce package

.PHONY:clean
clean:
	$(MAKE) -C $(DICT_VIEW)	clean
	rm -rf out *.vsix

.PHONY:unit
unit: $(TS_SRC) $(TS_TEST)
	node --inspect --trace-uncaught ./node_modules/.bin/mocha --ui tdd --require ts-node/register --watch-extensions ts,tsx \"./src/unittest/**/*.{ts,tsx}\"


.PHONY:refresh
refresh:
	make clean	
	make install