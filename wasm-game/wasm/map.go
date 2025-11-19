package main

import "syscall/js"

type TileMap struct {
	Cols int
	Rows int
	Tile int
	data []int
}

func NewTileMap(cols, rows, tile int) *TileMap {
	m := &TileMap{
		Cols: cols,
		Rows: rows,
		Tile: tile,
		data: make([]int, cols*rows),
	}
	// Generate simple biomes: forest/lake/forbidden with patterns
	for y := 0; y < rows; y++ {
		for x := 0; x < cols; x++ {
			// borders forbidden
			if x == 0 || y == 0 || x == cols-1 || y == rows-1 {
				m.Set(x, y, 2) // forbidden
				continue
			}
			// lakes as circles
			cx, cy := cols/3, rows/3
			dx := x - cx
			dy := y - cy
			if dx*dx+dy*dy < 400 {
				m.Set(x, y, 3) // lake
				continue
			}
			// forest default
			m.Set(x, y, 0)
		}
	}
	return m
}

func (m *TileMap) Width() int  { return m.Cols }
func (m *TileMap) Height() int { return m.Rows }

func (m *TileMap) Index(x, y int) int { return y*m.Cols + x }
func (m *TileMap) Get(x, y int) int   { return m.data[m.Index(x, y)] }
func (m *TileMap) Set(x, y, v int)    { m.data[m.Index(x, y)] = v }

func (m *TileMap) Collides(px, py, pw, ph float64) bool {
	left := int(px) / m.Tile
	right := int(px+pw-1) / m.Tile
	top := int(py) / m.Tile
	bottom := int(py+ph-1) / m.Tile
	for y := top; y <= bottom; y++ {
		for x := left; x <= right; x++ {
			if x < 0 || y < 0 || x >= m.Cols || y >= m.Rows {
				return true
			}
			if m.Get(x, y) == 1 {
				return true
			}
		}
	}
	return false
}

func (m *TileMap) DrawViewport(ctx js.Value, camX, camY, w, h int) {
	firstX := camX / m.Tile
	firstY := camY / m.Tile
	lastX := (camX + w) / m.Tile
	lastY := (camY + h) / m.Tile
	if lastX >= m.Cols {
		lastX = m.Cols - 1
	}
	if lastY >= m.Rows {
		lastY = m.Rows - 1
	}
	for y := firstY; y <= lastY; y++ {
		for x := firstX; x <= lastX; x++ {
			switch m.Get(x, y) {
			case 2:
				ctx.Set("fillStyle", "#3b1d1d") // forbidden
			case 3:
				ctx.Set("fillStyle", "#0f2a3a") // lake
			default:
				ctx.Set("fillStyle", "#0f172a") // forest
			}
			ctx.Call("fillRect", x*m.Tile-camX, y*m.Tile-camY, m.Tile-1, m.Tile-1)
		}
	}
}


