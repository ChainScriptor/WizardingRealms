package main

import (
	"math"
	"syscall/js"
)

type Player struct {
	X, Y float64
	W, H float64
	Spd  float64
}

func (p *Player) Move(dx, dy, dt float64, m *TileMap) {
	if dx != 0 || dy != 0 {
		// normalize
		l := math.Sqrt(dx*dx + dy*dy)
		dx /= l
		dy /= l
	}
	nx := p.X + dx*p.Spd*dt
	if !m.Collides(nx, p.Y, p.W, p.H) {
		p.X = nx
	}
	ny := p.Y + dy*p.Spd*dt
	if !m.Collides(p.X, ny, p.W, p.H) {
		p.Y = ny
	}
}

func (p *Player) Draw(ctx js.Value) {
	ctx.Set("fillStyle", "#3a9bff")
	ctx.Call("fillRect", int(p.X), int(p.Y), int(p.W), int(p.H))
	ctx.Set("strokeStyle", "#93c5fd")
	ctx.Call("strokeRect", int(p.X), int(p.Y), int(p.W), int(p.H))
}

func (p *Player) DrawAt(ctx js.Value, x, y float64) {
	ctx.Set("fillStyle", "#3a9bff")
	ctx.Call("fillRect", int(x), int(y), int(p.W), int(p.H))
	ctx.Set("strokeStyle", "#93c5fd")
	ctx.Call("strokeRect", int(x), int(y), int(p.W), int(p.H))
}


