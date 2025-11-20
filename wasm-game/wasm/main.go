package main

import (
	"syscall/js"
	"time"
)

var (
	game     *Game
	lastTime time.Time
)

func main() {
	canvas := js.Global().Get("document").Call("getElementById", "game")
	ctx := canvas.Call("getContext", "2d")

	game = NewGame(canvas, ctx)
	game.Init()
	lastTime = time.Now()

	// Input listeners
	js.Global().Call("addEventListener", "keydown", js.FuncOf(onKeyDown))
	js.Global().Call("addEventListener", "keyup", js.FuncOf(onKeyUp))
	js.Global().Call("addEventListener", "resize", js.FuncOf(onResize))
	resizeCanvas(canvas)

	// RAF loop
	var cb js.Func
	cb = js.FuncOf(func(this js.Value, args []js.Value) any {
		now := time.Now()
		dt := now.Sub(lastTime).Seconds()
		lastTime = now

		game.Update(dt)
		game.Render()

		js.Global().Call("requestAnimationFrame", cb)
		return nil
	})
	js.Global().Call("requestAnimationFrame", cb)
	select {}
}

func onKeyDown(this js.Value, args []js.Value) any {
	e := args[0]
	k := e.Get("key").String()
	if k == " " || k == "Spacebar" {
		// claim current tile
		go claimCurrentTile()
	} else if k == "+" || k == "=" {
		game.AdjustZoom(0.1)
		return nil
	} else if k == "-" || k == "_" {
		game.AdjustZoom(-0.1)
		return nil
	}
	game.Input[k] = true
	return nil
}

func onKeyUp(this js.Value, args []js.Value) any {
	e := args[0]
	k := e.Get("key").String()
	delete(game.Input, k)
	return nil
}

func onResize(this js.Value, args []js.Value) any {
	canvas := js.Global().Get("document").Call("getElementById", "game")
	resizeCanvas(canvas)
	return nil
}

func resizeCanvas(canvas js.Value) {
	w := js.Global().Get("innerWidth").Int()
	h := js.Global().Get("innerHeight").Int()
	margin := 40
	if w > 1280 {
		w = 1280
	}
	if h > 720 {
		h = 720
	}
	canvas.Set("width", w-margin)
	canvas.Set("height", h-margin)
}

func claimCurrentTile() {
	tileX := int(game.Player.X) / game.Map.Tile
	tileY := int(game.Player.Y) / game.Map.Tile
	payload := js.Global().Get("JSON").Call("stringify", mapToJS(map[string]any{
		"tile_x": tileX,
		"tile_y": tileY,
		"wallet": "",
	}))
	reqInit := map[string]any{
		"method": "POST",
		"headers": mapToJS(map[string]any{
			"Content-Type": "application/json",
		}),
		"body": payload,
	}
	fetch := js.Global().Get("fetch")
	fetch.Invoke("/api/claim", mapToJS(reqInit))
}

func mapToJS(m map[string]any) js.Value {
	obj := js.Global().Get("Object").New()
	for k, v := range m {
		obj.Set(k, v)
	}
	return obj
}


