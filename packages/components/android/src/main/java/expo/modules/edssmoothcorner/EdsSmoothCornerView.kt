package expo.modules.edssmoothcorner

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Outline
import android.graphics.Paint
import android.graphics.Path
import android.os.Build
import android.view.View
import android.view.ViewOutlineProvider
import android.view.ViewTreeObserver
import com.facebook.react.uimanager.BackgroundStyleApplicator
import com.facebook.react.uimanager.style.BorderRadiusProp
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView
import kotlin.math.min

/**
 * 平滑圆角裁切容器（Android 13+ Outline path 裁切子视图 · 含 blur / 背景 / 内容）。
 * 描边沿同一路径绘制在子视图之上（2× 线宽居中描边，外半被裁，可见宽度 = strokeWidth）。
 */
class EdsSmoothCornerView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val density = resources.displayMetrics.density
  private val path = Path()
  private val strokePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE }

  private var radiusDp = -1f
  private var smoothing = 0.6f
  private var strokeWidthPx = 0f
  private var appliedRadiusPx = -1f

  private val preDrawListener = ViewTreeObserver.OnPreDrawListener {
    syncRadius()
    true
  }

  init {
    outlineProvider = object : ViewOutlineProvider() {
      override fun getOutline(view: View, outline: Outline) {
        if (width <= 0 || height <= 0) return
        when {
          appliedRadiusPx <= 0f -> outline.setRect(0, 0, width, height)
          Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU -> outline.setPath(path)
          else -> outline.setRoundRect(0, 0, width, height, appliedRadiusPx)
        }
      }
    }
    clipToOutline = true
  }

  fun setRadiusDp(value: Float) {
    radiusDp = value
    syncRadius()
  }

  fun setSmoothing(value: Float) {
    smoothing = value.coerceIn(0f, 1f)
    rebuild()
  }

  fun setStrokeWidthDp(value: Float) {
    strokeWidthPx = value.coerceAtLeast(0f) * density
    invalidate()
  }

  fun setStrokeColor(color: Int) {
    strokePaint.color = color
    invalidate()
  }

  private fun resolveRadiusPx(): Float {
    if (radiusDp >= 0f) return radiusDp * density
    val host = parent as? View ?: return 0f
    val radius = BackgroundStyleApplicator.getBorderRadius(host, BorderRadiusProp.BORDER_RADIUS)
      ?: return 0f
    return radius.resolve(min(host.width, host.height) / density) * density
  }

  private fun syncRadius() {
    val next = resolveRadiusPx()
    if (next != appliedRadiusPx) {
      appliedRadiusPx = next
      rebuild()
    }
  }

  private fun rebuild() {
    SmoothCornerPath.build(path, width.toFloat(), height.toFloat(), appliedRadiusPx, smoothing)
    invalidateOutline()
    invalidate()
  }

  override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
    super.onSizeChanged(w, h, oldw, oldh)
    syncRadius()
    rebuild()
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    viewTreeObserver.addOnPreDrawListener(preDrawListener)
  }

  override fun onDetachedFromWindow() {
    viewTreeObserver.removeOnPreDrawListener(preDrawListener)
    super.onDetachedFromWindow()
  }

  override fun dispatchDraw(canvas: Canvas) {
    super.dispatchDraw(canvas)
    if (strokeWidthPx > 0f && Color.alpha(strokePaint.color) > 0) {
      strokePaint.strokeWidth = strokeWidthPx * 2f
      canvas.drawPath(path, strokePaint)
    }
  }
}
