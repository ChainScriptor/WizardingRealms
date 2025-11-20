package main

import "syscall/js"

const (
	TileForest = iota
	TileWall
	TileForbidden
	TileLake
	TileMountain
	TileDesert
)

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
	generateBiomes(m)
	return m
}

func generateBiomes(m *TileMap) {
	for y := 0; y < m.Rows; y++ {
		for x := 0; x < m.Cols; x++ {
			if x == 0 || y == 0 || x == m.Cols-1 || y == m.Rows-1 {
				m.Set(x, y, TileForbidden)
				continue
			}
			noise := pseudoNoise(x, y)
			switch {
			case noise < 4:
				m.Set(x, y, TileLake)
			case noise < 10:
				m.Set(x, y, TileMountain)
			case noise < 16:
				m.Set(x, y, TileWall)
			case noise < 22:
				m.Set(x, y, TileDesert)
			default:
				m.Set(x, y, TileForest)
			}
		}
	}
}

func pseudoNoise(x, y int) int {
	n := (x*92837111 + y*689287499) ^ (x*y + 374761393)
	if n < 0 {
		n = -n
	}
	return n % 100
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
			tile := m.Get(x, y)
			if tile == TileWall || tile == TileForbidden || tile == TileLake || tile == TileMountain {
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
			case TileForbidden:
				ctx.Set("fillStyle", "#251414")
			case TileLake:
				ctx.Set("fillStyle", "#123d63")
			case TileMountain:
				ctx.Set("fillStyle", "#2b2f3d")
			case TileWall:
				ctx.Set("fillStyle", "#3b3b45")
			case TileDesert:
				ctx.Set("fillStyle", "#5b420f")
			default:
				ctx.Set("fillStyle", "#0f1b2d")
			}
			ctx.Call("fillRect", x*m.Tile-camX, y*m.Tile-camY, m.Tile-1, m.Tile-1)
		}
	}
}


