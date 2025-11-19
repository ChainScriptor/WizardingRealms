SHELL := /bin/sh

GO      ?= go
PORT    ?= 8080
WEB_DIR := web
WASM_OUT := $(WEB_DIR)/game.wasm
WASM_SRC := ./wasm

.PHONY: build wasm_exec serve clean dev wasm deps

build: $(WASM_OUT)

$(WASM_OUT):
	@echo "==> Building WASM to $(WASM_OUT)"
	@mkdir -p $(WEB_DIR)
	GOOS=js GOARCH=wasm $(GO) build -o $(WASM_OUT) $(WASM_SRC)

deps:
	@echo "==> Resolving Go modules (go mod tidy && download)"
	@$(GO) mod tidy
	@$(GO) mod download

wasm_exec:
	@echo "==> Copying wasm_exec.js to $(WEB_DIR)"
	@mkdir -p $(WEB_DIR)
	@cp $$($(GO) env GOROOT)/misc/wasm/wasm_exec.js $(WEB_DIR)/wasm_exec.js

serve: deps build wasm_exec
	@echo "==> Starting local server on http://localhost:$(PORT)"
	@PORT=$(PORT) $(GO) run .

dev: serve

wasm: build

clean:
	@rm -f $(WASM_OUT) $(WEB_DIR)/wasm_exec.js
	@echo "==> Cleaned"


