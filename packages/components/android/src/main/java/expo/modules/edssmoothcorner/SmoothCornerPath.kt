package expo.modules.edssmoothcorner

import android.graphics.Path
import android.graphics.RectF
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.hypot
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sin
import kotlin.math.sqrt
import kotlin.math.tan

/**
 * Figma corner smoothing（squircle）路径 · 与 figma-squircle 同算法（非 preserveSmoothing：
 * 半径 / 平滑度受短边一半的预算约束）。四角同半径，顺时针（y 向下）。
 */
internal object SmoothCornerPath {
  private class Corner(
    val a: Float,
    val b: Float,
    val c: Float,
    val d: Float,
    val p: Float,
    val arc: Float,
    val r: Float,
  )

  private fun rad(deg: Float): Double = Math.toRadians(deg.toDouble())

  private fun corner(radius: Float, smoothing: Float, budget: Float): Corner {
    val r = min(radius, budget)
    val s = min(smoothing, budget / r - 1f).coerceAtLeast(0f)
    val p = min((1f + s) * r, budget)
    val arcMeasure = 90f * (1f - s)
    val arc = (sin(rad(arcMeasure / 2f)) * r * sqrt(2.0)).toFloat()
    val alpha = (90f - arcMeasure) / 2f
    val p3ToP4 = (r * tan(rad(alpha / 2f))).toFloat()
    val beta = 45f * s
    val c = (p3ToP4 * cos(rad(beta))).toFloat()
    val d = (c * tan(rad(beta))).toFloat()
    val b = (p - arc - c - d) / 3f
    return Corner(a = 2f * b, b = b, c = c, d = d, p = p, arc = arc, r = r)
  }

  private class Pen(val path: Path) {
    var x = 0f
    var y = 0f
    private val oval = RectF()

    fun moveTo(nx: Float, ny: Float) {
      path.moveTo(nx, ny); x = nx; y = ny
    }

    fun lineTo(nx: Float, ny: Float) {
      path.lineTo(nx, ny); x = nx; y = ny
    }

    fun cubic(x1: Float, y1: Float, x2: Float, y2: Float, dx: Float, dy: Float) {
      path.cubicTo(x + x1, y + y1, x + x2, y + y2, x + dx, y + dy)
      x += dx; y += dy
    }

    /** SVG 相对 `a r r 0 0 1 dx dy`（小弧 · 顺时针）→ Path.arcTo。 */
    fun arc(dx: Float, dy: Float, r: Float) {
      val len = hypot(dx, dy)
      if (r <= 0f || len <= 0f) {
        lineTo(x + dx, y + dy); return
      }
      val h = sqrt(max(0f, r * r - (len / 2f) * (len / 2f)))
      val ux = dx / len
      val uy = dy / len
      val cx = x + dx / 2f - uy * h
      val cy = y + dy / 2f + ux * h
      val start = Math.toDegrees(atan2((y - cy).toDouble(), (x - cx).toDouble())).toFloat()
      val end = Math.toDegrees(atan2((y + dy - cy).toDouble(), (x + dx - cx).toDouble())).toFloat()
      var sweep = end - start
      while (sweep <= 0f) sweep += 360f
      while (sweep > 360f) sweep -= 360f
      oval.set(cx - r, cy - r, cx + r, cy + r)
      path.arcTo(oval, start, sweep, false)
      x += dx; y += dy
    }
  }

  fun build(path: Path, width: Float, height: Float, radius: Float, smoothing: Float) {
    path.reset()
    if (width <= 0f || height <= 0f) return
    val budget = min(width, height) / 2f
    if (radius <= 0f || budget <= 0f) {
      path.addRect(0f, 0f, width, height, Path.Direction.CW)
      return
    }
    val k = corner(radius, smoothing, budget)
    val abc = k.a + k.b + k.c
    val bc = k.b + k.c
    val ab = k.a + k.b
    val pen = Pen(path)

    pen.moveTo(width - k.p, 0f)
    pen.cubic(k.a, 0f, ab, 0f, abc, k.d)
    pen.arc(k.arc, k.arc, k.r)
    pen.cubic(k.d, k.c, k.d, bc, k.d, abc)

    pen.lineTo(width, height - k.p)
    pen.cubic(0f, k.a, 0f, ab, -k.d, abc)
    pen.arc(-k.arc, k.arc, k.r)
    pen.cubic(-k.c, k.d, -bc, k.d, -abc, k.d)

    pen.lineTo(k.p, height)
    pen.cubic(-k.a, 0f, -ab, 0f, -abc, -k.d)
    pen.arc(-k.arc, -k.arc, k.r)
    pen.cubic(-k.d, -k.c, -k.d, -bc, -k.d, -abc)

    pen.lineTo(0f, k.p)
    pen.cubic(0f, -k.a, 0f, -ab, k.d, -abc)
    pen.arc(k.arc, -k.arc, k.r)
    pen.cubic(k.c, -k.d, bc, -k.d, abc, -k.d)

    path.close()
  }
}
