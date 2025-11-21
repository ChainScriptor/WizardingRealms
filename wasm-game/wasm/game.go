package main

import (
	"fmt"
	"math"
	"syscall/js"
)

type Game struct {
	Canvas js.Value
	Ctx    js.Value

	Map    *TileMap
	Player *Player

	Input map[string]bool

	cameraX int
	cameraY int

	heroImage js.Value
	heroReady bool
	zoom      float64

	wheelHandler js.Func
}

func NewGame(canvas, ctx js.Value) *Game {
	return &Game{
		Canvas: canvas,
		Ctx:    ctx,
		Input:  map[string]bool{},
		zoom:   1,
	}
}

func (g *Game) Init() {
	// 2048x2048 world with 24px tiles (do not draw all; render viewport)
	g.Map = NewTileMap(2048, 2048, 24)
	g.Player = &Player{
		X:   float64(g.Map.Width()*g.Map.Tile/2 - 12),
		Y:   float64(g.Map.Height()*g.Map.Tile/2 - 12),
		W:   18,
		H:   18,
		Spd: 220,
	}
	g.cameraX = int(g.Player.X) - 200
	g.cameraY = int(g.Player.Y) - 150
	g.bindTouch()
	g.bindZoom()
	g.loadHeroSprite()
}

func (g *Game) Update(dt float64) {
	var dx, dy float64
	if g.Input["ArrowLeft"] || g.Input["a"] || g.Input["A"] {
		dx -= 1
	}
	if g.Input["ArrowRight"] || g.Input["d"] || g.Input["D"] {
		dx += 1
	}
	if g.Input["ArrowUp"] || g.Input["w"] || g.Input["W"] {
		dy -= 1
	}
	if g.Input["ArrowDown"] || g.Input["s"] || g.Input["S"] {
		dy += 1
	}
	g.Player.Move(dx, dy, dt, g.Map)

	visibleW := int(float64(g.Canvas.Get("width").Int()) / g.zoom)
	visibleH := int(float64(g.Canvas.Get("height").Int()) / g.zoom)
	g.cameraX = clampInt(int(g.Player.X)-visibleW/2+int(g.Player.W/2), 0, g.Map.Cols*g.Map.Tile-visibleW)
	g.cameraY = clampInt(int(g.Player.Y)-visibleH/2+int(g.Player.H/2), 0, g.Map.Rows*g.Map.Tile-visibleH)
}

func (g *Game) Render() {
	w := float64(g.Canvas.Get("width").Int())
	h := float64(g.Canvas.Get("height").Int())
	visibleW := int(w / g.zoom)
	visibleH := int(h / g.zoom)

	// clear
	g.Ctx.Set("fillStyle", "#0b1020")
	g.Ctx.Call("fillRect", 0, 0, w, h)

	g.Ctx.Call("save")
	g.Ctx.Call("scale", g.zoom, g.zoom)

	g.Map.DrawViewport(g.Ctx, g.cameraX, g.cameraY, visibleW, visibleH)
	screenX := g.Player.X - float64(g.cameraX)
	screenY := g.Player.Y - float64(g.cameraY)
	if g.heroReady && g.heroImage.Truthy() {
		g.Ctx.Call("drawImage", g.heroImage, int(screenX), int(screenY), int(g.Player.W), int(g.Player.H))
	} else {
		g.Player.DrawAt(g.Ctx, screenX, screenY)
	}

	g.Ctx.Call("restore")

	// HUD
	g.Ctx.Set("fillStyle", "#cbd5e1")
	g.Ctx.Set("font", "12px monospace")
	msg := fmt.Sprintf("WASD/Arrows to move • Pos (%.0f,%.0f) • Zoom %.2fx • SPACE=claim", g.Player.X/float64(g.Map.Tile), g.Player.Y/float64(g.Map.Tile), g.zoom)
	g.Ctx.Call("fillText", msg, 12, 18)
}

func (g *Game) bindTouch() {
	canvas := g.Canvas
	var startX, startY float64
	var active bool
	canvas.Call("addEventListener", "touchstart", js.FuncOf(func(this js.Value, args []js.Value) any {
		t := args[0].Get("touches").Index(0)
		startX = t.Get("clientX").Float()
		startY = t.Get("clientY").Float()
		active = true
		return nil
	}))
	canvas.Call("addEventListener", "touchmove", js.FuncOf(func(this js.Value, args []js.Value) any {
		if !active {
			return nil
		}
		t := args[0].Get("touches").Index(0)
		dx := t.Get("clientX").Float() - startX
		dy := t.Get("clientY").Float() - startY2
		// simulate keys
		g.Input["ArrowLeft"] = dx < -10
		g.Input["ArrowRight"] = dx > 10
		g.Input["ArrowUp"] = dy < -10
		g.Input["ArrowDown"] = dy > 10
		return nil
	}))
	canvas.Call("addEventListener", "touchend", js.FuncOf(func(this js.Value, args []js.Value) any {
		active = false
		g.Input = map[string]bool{}
		return nil
	}))
}

func (g *Game) bindZoom() {
	canvas := g.Canvas
	g.wheelHandler = js.FuncOf(func(this js.Value, args []js.Value) any {
		event := args[0]
		delta := event.Get("deltaY").Float()
		g.AdjustZoom(-delta * 0.001)
		event.Call("preventDefault")
		return nil
	})
	canvas.Call("addEventListener", "wheel", g.wheelHandler)
}

func (g *Game) AdjustZoom(delta float64) {
	g.zoom = clampFloat(g.zoom+delta, 0.5, 2.5)
}

func clampInt(v, min, max int) int {
	if max < min {
		return min
	}
	if v < min {
		return min
	}
	if v > max {
		return max
	}
	return v
}

func clampFloat(v, min, max float64) float64 {
	return math.Max(min, math.Min(max, v))
}
