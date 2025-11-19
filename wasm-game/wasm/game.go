package main

import (
	"fmt"
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
}

func NewGame(canvas, ctx js.Value) *Game {
	return &Game{
		Canvas: canvas,
		Ctx:    ctx,
		Input:  map[string]bool{},
	}
}

func (g *Game) Init() {
	// 2048x2048 world with 24px tiles (do not draw all; render viewport)
	g.Map = NewTileMap(2048, 2048, 24)
	g.Player = &Player{
		X:  float64(g.Map.Width()*g.Map.Tile/2 - 12),
		Y:  float64(g.Map.Height()*g.Map.Tile/2 - 12),
		W:  18,
		H:  18,
		Spd: 220,
	}
	g.cameraX = int(g.Player.X) - 200
	g.cameraY = int(g.Player.Y) - 150
	g.bindTouch()
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

	// camera follow
	g.cameraX = int(g.Player.X) - g.Canvas.Get("width").Int()/2 + int(g.Player.W/2)
	g.cameraY = int(g.Player.Y) - g.Canvas.Get("height").Int()/2 + int(g.Player.H/2)
	if g.cameraX < 0 {
		g.cameraX = 0
	}
	if g.cameraY < 0 {
		g.cameraY = 0
	}
}

func (g *Game) Render() {
	w := g.Canvas.Get("width").Int()
	h := g.Canvas.Get("height").Int()

	// clear
	g.Ctx.Set("fillStyle", "#0b1020")
	g.Ctx.Call("fillRect", 0, 0, w, h)

	g.Map.DrawViewport(g.Ctx, g.cameraX, g.cameraY, w, h)
	g.Player.DrawAt(g.Ctx, float64(int(g.Player.X)-g.cameraX), float64(int(g.Player.Y)-g.cameraY))

	// HUD
	g.Ctx.Set("fillStyle", "#cbd5e1")
	g.Ctx.Set("font", "12px monospace")
	msg := fmt.Sprintf("WASD/Arrows to move • 2048x2048 • Pos (%.0f,%.0f) • SPACE=claim", g.Player.X/float64(g.Map.Tile), g.Player.Y/float64(g.Map.Tile))
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
		dy := t.Get("clientY").Float() - startY
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


