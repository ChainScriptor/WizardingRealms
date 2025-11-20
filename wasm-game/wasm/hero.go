//go:build js && wasm

package main

import (
	"bytes"
	_ "embed"
	"encoding/base64"
	"image"
	"image/draw"
	_ "image/jpeg"
	_ "image/png"
	"strings"
	"syscall/js"
)

//go:embed assets/hero.txt
var heroDataURI string

func (g *Game) loadHeroSprite() {
	rgba, err := decodeHeroImage()
	if err != nil {
		js.Global().Get("console").Call("error", "hero decode:", err.Error())
		return
	}
	if rgba == nil {
		js.Global().Get("console").Call("warn", "hero sprite missing data")
		return
	}

	uint8Array := js.Global().Get("Uint8ClampedArray").New(len(rgba.Pix))
	js.CopyBytesToJS(uint8Array, rgba.Pix)

	imageDataCtor := js.Global().Get("ImageData")
	if !imageDataCtor.Truthy() {
		js.Global().Get("console").Call("warn", "ImageData constructor missing")
		return
	}
	imgData := imageDataCtor.New(uint8Array, rgba.Rect.Dx(), rgba.Rect.Dy())

	doc := js.Global().Get("document")
	canvas := doc.Call("createElement", "canvas")
	canvas.Set("width", rgba.Rect.Dx())
	canvas.Set("height", rgba.Rect.Dy())
	ctx := canvas.Call("getContext", "2d")
	ctx.Call("putImageData", imgData, 0, 0)

	g.heroImage = canvas
	g.heroReady = true
}

func decodeHeroImage() (*image.NRGBA, error) {
	if heroDataURI == "" {
		return nil, nil
	}
	data := strings.TrimSpace(heroDataURI)
	if idx := strings.Index(data, ","); idx != -1 {
		data = data[idx+1:]
	}
	data = strings.ReplaceAll(data, "\n", "")
	data = strings.ReplaceAll(data, "\r", "")
	data = strings.ReplaceAll(data, " ", "")
	raw, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return nil, err
	}
	img, _, err := image.Decode(bytes.NewReader(raw))
	if err != nil {
		return nil, err
	}
	b := img.Bounds()
	rgba := image.NewNRGBA(image.Rect(0, 0, b.Dx(), b.Dy()))
	draw.Draw(rgba, rgba.Bounds(), img, b.Min, draw.Src)
	return rgba, nil
}

